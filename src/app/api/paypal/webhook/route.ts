import { NextResponse } from 'next/server';
import {
  PaypalApiError,
  PaypalConfigError,
  verifyWebhookSignature,
} from '@/lib/server/paypal';
import {
  findContributionByOrderId,
  markContributionPaid,
  markContributionStatus,
  recordWebhookEventIfNew,
} from '@/lib/server/storage';

export const runtime = 'nodejs';

interface WebhookEvent {
  id: string;
  event_type: string;
  resource: Record<string, unknown> & {
    id?: string;
    status?: string;
    supplementary_data?: {
      related_ids?: { order_id?: string };
    };
  };
}

export async function POST(req: Request) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim();
  if (!webhookId) {
    console.error('[paypal-webhook] PAYPAL_WEBHOOK_ID not set; rejecting webhook');
    return NextResponse.json({ ok: false, error: 'webhook not configured' }, { status: 500 });
  }

  const rawBody = await req.text();

  let verified = false;
  try {
    verified = await verifyWebhookSignature({
      authAlgo: req.headers.get('paypal-auth-algo') ?? '',
      certUrl: req.headers.get('paypal-cert-url') ?? '',
      transmissionId: req.headers.get('paypal-transmission-id') ?? '',
      transmissionSig: req.headers.get('paypal-transmission-sig') ?? '',
      transmissionTime: req.headers.get('paypal-transmission-time') ?? '',
      webhookId,
      rawBody,
    });
  } catch (err) {
    if (err instanceof PaypalConfigError || err instanceof PaypalApiError) {
      console.error('[paypal-webhook] signature verification call failed', err);
    } else {
      console.error('[paypal-webhook] unexpected error verifying signature', err);
    }
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  if (!verified) {
    console.warn('[paypal-webhook] signature verification failed');
    return NextResponse.json({ ok: false, error: 'signature invalid' }, { status: 400 });
  }

  let event: WebhookEvent;
  try {
    event = JSON.parse(rawBody) as WebhookEvent;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON' }, { status: 400 });
  }

  if (!event.id || !event.event_type) {
    return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
  }

  const isNew = await recordWebhookEventIfNew({
    eventId: event.id,
    eventType: event.event_type,
    resourceId: event.resource?.id,
    verified: true,
    receivedAt: new Date().toISOString(),
  });
  if (!isNew) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    await dispatch(event);
  } catch (err) {
    console.error('[paypal-webhook] handler failed', event.event_type, err);
    // Return 200 anyway so PayPal does not infinitely retry on bugs we caused;
    // the event is still persisted for manual reprocessing.
    return NextResponse.json({ ok: true, handled: false });
  }

  return NextResponse.json({ ok: true });
}

async function dispatch(event: WebhookEvent): Promise<void> {
  const orderId =
    event.resource?.supplementary_data?.related_ids?.order_id ??
    (event.event_type.startsWith('CHECKOUT.ORDER.') ? event.resource?.id : undefined);

  if (!orderId) {
    console.warn('[paypal-webhook] event without order id', event.event_type);
    return;
  }

  const contribution = await findContributionByOrderId(orderId);
  if (!contribution) {
    console.warn('[paypal-webhook] no contribution for order', orderId);
    return;
  }

  switch (event.event_type) {
    case 'PAYMENT.CAPTURE.COMPLETED': {
      if (contribution.status !== 'paid') {
        const captureId = (event.resource?.id as string | undefined) ?? '';
        await markContributionPaid(contribution.id, captureId, event.resource);
      }
      return;
    }
    case 'PAYMENT.CAPTURE.DENIED':
    case 'PAYMENT.CAPTURE.DECLINED': {
      await markContributionStatus(contribution.id, 'failed');
      return;
    }
    case 'PAYMENT.CAPTURE.REFUNDED':
    case 'PAYMENT.CAPTURE.REVERSED': {
      await markContributionStatus(contribution.id, 'refunded');
      return;
    }
    default:
      // Unhandled but recorded.
      return;
  }
}
