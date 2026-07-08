import { sendEmail, adminNotificationAddress } from '@/lib/server/email';
import type { SavedContactMessage } from '@/lib/server/storage';

const BRAND = {
  name: 'Infact Solutions',
  red: '#DA3445',
  redDark: '#B7273A',
  ink: '#1a1a1a',
  muted: '#6b7280',
  border: '#e5e7eb',
  bg: '#f4f4f5',
  card: '#ffffff',
};

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/$/, '')) || 'https://infactsolutions.net';
}

/** Escape user-supplied text for safe interpolation into HTML. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Preserve line breaks from the visitor's message in HTML. */
function nl2br(value: string): string {
  return esc(value).replace(/\r?\n/g, '<br />');
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || 'there';
}

/**
 * Renders the branded HTML acknowledgement sent to the person who contacted us.
 * Built with table layout + inline styles for broad email-client support.
 */
export function renderContactAckHtml(data: SavedContactMessage['data'], referenceId: string): string {
  const site = baseUrl();
  const logo = `${site}/logo.png`;
  const preheader = "Thanks for reaching out — we've received your message and will reply within 24 hours.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="light only" />
<title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;visibility:hidden;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:${BRAND.card};border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,0.06);border:1px solid ${BRAND.border};">
          <!-- brand bar -->
          <tr><td style="height:5px;background:linear-gradient(90deg,${BRAND.red},${BRAND.redDark});font-size:0;line-height:0;">&nbsp;</td></tr>
          <!-- logo on dark band (logo artwork is white) -->
          <tr>
            <td align="center" bgcolor="${BRAND.ink}" style="padding:34px 32px;background-color:${BRAND.ink};">
              <img src="${logo}" alt="${BRAND.name}" width="200" style="display:block;width:200px;max-width:72%;height:auto;border:0;" />
            </td>
          </tr>
          <!-- headline -->
          <tr>
            <td align="center" style="padding:16px 32px 0 32px;">
              <div style="display:inline-block;background-color:rgba(218,52,69,0.10);color:${BRAND.red};font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;padding:6px 14px;border-radius:999px;">Message received</div>
              <h1 style="margin:18px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:1.25;color:${BRAND.ink};font-weight:800;">Thanks for reaching out, ${esc(firstName(data.name))}!</h1>
            </td>
          </tr>
          <!-- intro -->
          <tr>
            <td style="padding:16px 40px 8px 40px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:#3f3f46;text-align:center;">
                We've received your message and a member of our team will get back to you within <strong style="color:${BRAND.ink};">24 hours</strong>. Here's a copy of what you sent us.
              </p>
            </td>
          </tr>
          <!-- submission card -->
          <tr>
            <td style="padding:20px 40px 8px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border:1px solid ${BRAND.border};border-radius:12px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:${BRAND.muted};">Subject</p>
                    <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:${BRAND.ink};font-weight:600;">${esc(data.subject)}</p>
                    <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:${BRAND.muted};">Message</p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#3f3f46;">${nl2br(data.message)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- reference -->
          <tr>
            <td style="padding:14px 40px 4px 40px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${BRAND.muted};text-align:center;">
                Your reference number: <span style="color:${BRAND.ink};font-family:'Courier New',monospace;font-weight:700;">${esc(referenceId)}</span>
              </p>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td align="center" style="padding:22px 40px 8px 40px;">
              <a href="${site}" style="display:inline-block;background:linear-gradient(90deg,${BRAND.red},${BRAND.redDark});color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;text-decoration:none;padding:13px 30px;border-radius:10px;">Visit our website</a>
            </td>
          </tr>
          <!-- footer -->
          <tr>
            <td style="padding:24px 40px 34px 40px;">
              <hr style="border:none;border-top:1px solid ${BRAND.border};margin:0 0 18px 0;" />
              <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:${BRAND.ink};text-align:center;">${BRAND.name}</p>
              <p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${BRAND.muted};text-align:center;">
                IT &amp; Cybersecurity &middot; <a href="${site}" style="color:${BRAND.red};text-decoration:none;">infactsolutions.net</a>
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#a1a1aa;text-align:center;">
                You're receiving this email because you contacted us through our website. If this wasn't you, please ignore this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderContactAckText(data: SavedContactMessage['data'], referenceId: string): string {
  return [
    `Hi ${firstName(data.name)},`,
    '',
    "Thank you for reaching out to Infact Solutions. We've received your message and our team will get back to you within 24 hours.",
    '',
    'Here is a copy of what you sent:',
    `Subject: ${data.subject}`,
    '',
    data.message,
    '',
    `Your reference number: ${referenceId}`,
    '',
    `Visit us: ${baseUrl()}`,
    '',
    '— Infact Solutions',
    'IT & Cybersecurity · infactsolutions.net',
  ].join('\n');
}

/**
 * Sends the admin notification and the branded acknowledgement to the sender
 * for a newly received contact message.
 */
export async function sendContactMessageEmails(record: SavedContactMessage): Promise<void> {
  const { data } = record;

  // Notify the team (plain text — internal).
  await sendEmail({
    to: adminNotificationAddress(),
    subject: `[Contact] ${data.subject} — ${data.name}`,
    replyTo: data.email,
    text: [
      `Reference: ${record.id}`,
      '',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Subject: ${data.subject}`,
      '',
      'Message:',
      data.message,
    ].join('\n'),
  });

  // Branded acknowledgement to the sender.
  await sendEmail({
    to: data.email,
    subject: 'We received your message — Infact Solutions',
    text: renderContactAckText(data, record.id),
    html: renderContactAckHtml(data, record.id),
  });
}
