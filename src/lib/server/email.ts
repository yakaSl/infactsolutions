import { Resend } from 'resend';

export interface OutgoingEmail {
  to: string;
  subject: string;
  text: string;
  /** Optional HTML body. When set, `text` is sent as the plain-text fallback. */
  html?: string;
  replyTo?: string;
}

const ADMIN_FALLBACK = 'hello@infactsolutions.net';

export function adminNotificationAddress(): string {
  return process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || ADMIN_FALLBACK;
}

let cachedClient: Resend | null = null;
let warnedMissingKey = false;
let warnedMissingFrom = false;

function getClient(): Resend | null {
  if (cachedClient) return cachedClient;
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    if (!warnedMissingKey) {
      console.warn('[email] RESEND_API_KEY not set — emails will be logged to the console only.');
      warnedMissingKey = true;
    }
    return null;
  }
  cachedClient = new Resend(key);
  return cachedClient;
}

function getFromAddress(): string | null {
  const from = process.env.RESEND_FROM?.trim();
  if (!from) {
    if (!warnedMissingFrom) {
      console.warn('[email] RESEND_FROM not set — emails will be logged to the console only.');
      warnedMissingFrom = true;
    }
    return null;
  }
  return from;
}

export async function sendEmail(email: OutgoingEmail): Promise<{ ok: boolean; id?: string; error?: string }> {
  const client = getClient();
  const from = getFromAddress();

  if (!client || !from) {
    console.log('[email:stub] would send', {
      to: email.to,
      subject: email.subject,
      replyTo: email.replyTo,
      bodyPreview: email.text.slice(0, 200),
    });
    return { ok: true };
  }

  try {
    const result = await client.emails.send({
      from,
      to: email.to,
      subject: email.subject,
      text: email.text,
      ...(email.html ? { html: email.html } : {}),
      replyTo: email.replyTo,
    });
    if (result.error) {
      console.error('[email] resend returned error', result.error);
      return { ok: false, error: result.error.message };
    }
    return { ok: true, id: result.data?.id };
  } catch (err) {
    console.error('[email] send failed', err);
    return { ok: false, error: err instanceof Error ? err.message : 'unknown error' };
  }
}
