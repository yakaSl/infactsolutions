import { findContributionTarget } from '@/lib/contribution-targets';
import { sendEmail, adminNotificationAddress } from '@/lib/server/email';
import type { SavedContribution } from '@/lib/server/storage';

/**
 * Sends the admin notification and (for detailed donors) a donor receipt for a
 * paid donation. Safe to call from both the synchronous capture path and the
 * webhook backstop — callers must ensure it only runs on the transition to paid
 * so a donor is not emailed twice.
 */
export async function sendDonationPaidEmails(contribution: SavedContribution): Promise<void> {
  const { data } = contribution;
  const target = findContributionTarget(data.targetSlug);
  const donorLabel = data.donorMode === 'anonymous'
    ? 'Anonymous donor'
    : data.donorName?.trim() || 'Donor (name not provided)';

  await sendEmail({
    to: adminNotificationAddress(),
    subject: `[Donate] USD ${data.amount.toFixed(2)} for ${target?.label ?? data.targetSlug}`,
    replyTo: data.donorEmail,
    text: [
      `Reference: ${contribution.id}`,
      `PayPal order: ${contribution.paypalOrderId ?? '(missing)'}`,
      `PayPal capture: ${contribution.paypalCaptureId ?? '(pending)'}`,
      `Target: ${target?.label ?? data.targetSlug} (${data.targetSlug})`,
      `Amount: USD ${data.amount.toFixed(2)}`,
      `Donor mode: ${data.donorMode}`,
      `Donor: ${donorLabel}`,
      data.donorEmail ? `Email: ${data.donorEmail}` : 'Email: (not provided)',
      data.publicDisplayName ? `Public display name: ${data.publicDisplayName}` : '',
      data.message ? `\nMessage:\n${data.message}` : '',
    ].filter(Boolean).join('\n'),
  });

  if (data.donorMode === 'detailed' && data.donorEmail) {
    await sendEmail({
      to: data.donorEmail,
      subject: 'Thank you for supporting Infact Solutions',
      text: [
        `Hi${data.donorName ? ` ${data.donorName}` : ''},`,
        '',
        `Thank you for your donation of USD ${data.amount.toFixed(2)} to ${target?.label ?? 'our work'}.`,
        `Your reference number is: ${contribution.id}`,
        '',
        '— Infact Solutions',
      ].join('\n'),
    });
  }
}

/** Alerts the admin that a captured payment did not match the expected amount/currency. */
export async function sendDonationReviewAlert(
  contribution: SavedContribution,
  observed: { amountValue?: string; currencyCode?: string }
): Promise<void> {
  const { data } = contribution;
  await sendEmail({
    to: adminNotificationAddress(),
    subject: `[Donate][REVIEW] Amount mismatch on ${contribution.id}`,
    text: [
      'A PayPal capture completed but did NOT match the expected donation amount.',
      'The contribution has been marked review_required and NOT auto-confirmed.',
      '',
      `Reference: ${contribution.id}`,
      `PayPal order: ${contribution.paypalOrderId ?? '(missing)'}`,
      `PayPal capture: ${contribution.paypalCaptureId ?? '(unknown)'}`,
      `Expected: USD ${data.amount.toFixed(2)}`,
      `Observed: ${observed.currencyCode ?? '(none)'} ${observed.amountValue ?? '(none)'}`,
    ].join('\n'),
  });
}
