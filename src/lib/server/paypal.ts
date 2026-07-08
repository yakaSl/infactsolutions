// Lightweight PayPal REST client (Orders v2 + webhook signature verification).
// We intentionally avoid the official SDK to keep dependencies minimal.
// All money values are USD strings with two decimals (PayPal API requirement).

const DEFAULT_BASE_URL = 'https://api-m.sandbox.paypal.com';

export class PaypalConfigError extends Error {}
export class PaypalApiError extends Error {
  constructor(message: string, public status: number, public details?: unknown) {
    super(message);
  }
}

function getBaseUrl(): string {
  return process.env.PAYPAL_BASE_URL?.trim() || DEFAULT_BASE_URL;
}

function getCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new PaypalConfigError(
      'PayPal is not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env.'
    );
  }
  return { clientId, clientSecret };
}

// Cache access token across requests (lifetime ~9 hours; refresh 60s before expiry).
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const { clientId, clientSecret } = getCredentials();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(`${getBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new PaypalApiError(`PayPal token request failed: ${res.status}`, res.status, text);
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.token;
}

async function authedFetch(path: string, init: RequestInit & { idempotencyKey?: string } = {}) {
  const token = await getAccessToken();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');
  if (init.idempotencyKey) {
    headers.set('PayPal-Request-Id', init.idempotencyKey);
  }
  return fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });
}

export interface CreateOrderInput {
  /** USD amount, will be sent as a string with two decimals. */
  amountUsd: number;
  referenceId: string;
  description?: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface CreateOrderResult {
  orderId: string;
  approveUrl: string;
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const amountStr = input.amountUsd.toFixed(2);
  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: input.referenceId,
        description: input.description?.slice(0, 127),
        amount: { currency_code: 'USD', value: amountStr },
      },
    ],
    application_context: {
      brand_name: 'Infact Solutions',
      user_action: 'PAY_NOW',
      // BILLING = show the guest card-payment form first; PayPal login is secondary.
      // LOGIN (default) = show login first, hides guest checkout for many buyers.
      landing_page: 'BILLING',
      shipping_preference: 'NO_SHIPPING',
      return_url: input.returnUrl,
      cancel_url: input.cancelUrl,
    },
  };

  const res = await authedFetch('/v2/checkout/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
    idempotencyKey: input.referenceId,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new PaypalApiError(`PayPal createOrder failed: ${res.status}`, res.status, text);
  }
  const data = JSON.parse(text) as {
    id: string;
    links: Array<{ rel: string; href: string }>;
  };
  const approve = data.links.find((l) => l.rel === 'approve' || l.rel === 'payer-action');
  if (!approve) {
    throw new PaypalApiError('PayPal createOrder response missing approve link', 500, data);
  }
  return { orderId: data.id, approveUrl: approve.href };
}

export interface CaptureResult {
  status: string;
  captureId?: string;
  /** Captured amount as a two-decimal string, e.g. "25.00". */
  amountValue?: string;
  /** Captured currency, e.g. "USD". */
  currencyCode?: string;
  raw: unknown;
}

// Both the capture response and a GET /orders/{id} response share the same
// purchase_units[].payments.captures[] shape, so we extract from either.
function extractCaptureDetails(data: Record<string, unknown>): Omit<CaptureResult, 'raw'> {
  const purchaseUnits = (data.purchase_units as Array<Record<string, unknown>> | undefined) ?? [];
  const payments = purchaseUnits[0]?.payments as Record<string, unknown> | undefined;
  const captures = payments?.captures as Array<Record<string, unknown>> | undefined;
  const capture = captures?.[0];
  const amount = capture?.amount as { value?: string; currency_code?: string } | undefined;
  const status =
    (data.status as string | undefined) ??
    (capture?.status as string | undefined) ??
    'UNKNOWN';
  return {
    status,
    captureId: capture?.id as string | undefined,
    amountValue: amount?.value,
    currencyCode: amount?.currency_code,
  };
}

/** Fetch an order's current state (used to recover details of an already-captured order). */
export async function getOrder(orderId: string): Promise<CaptureResult> {
  const res = await authedFetch(`/v2/checkout/orders/${orderId}`, { method: 'GET' });
  const text = await res.text();
  if (!res.ok) {
    throw new PaypalApiError(`PayPal getOrder failed: ${res.status}`, res.status, text);
  }
  const data = JSON.parse(text) as Record<string, unknown>;
  return { ...extractCaptureDetails(data), raw: data };
}

export async function captureOrder(orderId: string): Promise<CaptureResult> {
  const res = await authedFetch(`/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    body: '{}',
    idempotencyKey: `capture-${orderId}`,
  });
  const text = await res.text();
  if (!res.ok) {
    // If the order was already captured (retry, double submit, or concurrent
    // return-page + webhook), recover the real capture state instead of failing.
    // Otherwise the caller would wrongly mark a paid donation as failed.
    if (res.status === 422 && text.includes('ORDER_ALREADY_CAPTURED')) {
      return getOrder(orderId);
    }
    throw new PaypalApiError(`PayPal captureOrder failed: ${res.status}`, res.status, text);
  }
  const data = JSON.parse(text) as Record<string, unknown>;
  return { ...extractCaptureDetails(data), raw: data };
}

export interface WebhookVerificationInput {
  authAlgo: string;
  certUrl: string;
  transmissionId: string;
  transmissionSig: string;
  transmissionTime: string;
  webhookId: string;
  rawBody: string;
}

export async function verifyWebhookSignature(input: WebhookVerificationInput): Promise<boolean> {
  const payload = {
    auth_algo: input.authAlgo,
    cert_url: input.certUrl,
    transmission_id: input.transmissionId,
    transmission_sig: input.transmissionSig,
    transmission_time: input.transmissionTime,
    webhook_id: input.webhookId,
    webhook_event: JSON.parse(input.rawBody),
  };

  const res = await authedFetch('/v1/notifications/verify-webhook-signature', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new PaypalApiError(`PayPal verify-webhook-signature failed: ${res.status}`, res.status, text);
  }
  const data = (await res.json()) as { verification_status?: string };
  return data.verification_status === 'SUCCESS';
}
