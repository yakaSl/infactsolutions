export interface OutgoingEmail {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

// TODO(phase-2): wire Resend
//   - npm i resend
//   - read RESEND_API_KEY + ADMIN_NOTIFICATION_EMAIL from env
//   - replace the console.log below with `await resend.emails.send({...})`
//   - keep this signature so call sites (server actions) don't change
export async function sendEmail(email: OutgoingEmail): Promise<{ ok: boolean }> {
  console.log('[email] would send', {
    to: email.to,
    subject: email.subject,
    replyTo: email.replyTo,
    bodyPreview: email.text.slice(0, 200),
  });
  return { ok: true };
}

const ADMIN_FALLBACK = 'hello@infactsolutions.net';

export function adminNotificationAddress(): string {
  return process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || ADMIN_FALLBACK;
}
