'use server';

import { donationSchema, type DonationFormValues } from '@/lib/contribution-schemas';
import { findContributionTarget } from '@/lib/contribution-targets';
import { saveDonationIntent } from '@/lib/server/storage';
import { sendEmail, adminNotificationAddress } from '@/lib/server/email';

export interface DonationActionResult {
  ok: boolean;
  referenceId?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function submitDonationIntent(input: DonationFormValues): Promise<DonationActionResult> {
  const parsed = donationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Some fields are invalid. Please review and try again.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

  if (!findContributionTarget(data.targetSlug)) {
    return { ok: false, message: 'Selected project is no longer available.' };
  }

  try {
    const record = await saveDonationIntent(data);

    // TODO(phase-2): replace the stub with a real PayPal order creation here.
    // For Phase 1, we simply notify the admin so they can follow up manually.
    const target = findContributionTarget(data.targetSlug);
    const donorLabel = data.donorMode === 'anonymous'
      ? 'Anonymous donor'
      : data.donorName?.trim() || 'Donor (name not provided)';

    await sendEmail({
      to: adminNotificationAddress(),
      subject: `[Donate] LKR ${data.amount.toLocaleString()} for ${target?.label ?? data.targetSlug}`,
      replyTo: data.donorEmail,
      text: [
        `Reference: ${record.id}`,
        `Target: ${target?.label ?? data.targetSlug} (${data.targetSlug})`,
        `Amount: LKR ${data.amount.toLocaleString()}`,
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
          `Thank you for your intent to contribute LKR ${data.amount.toLocaleString()} to ${target?.label ?? 'our work'}.`,
          'Your reference number is: ' + record.id,
          '',
          'Our team will follow up shortly with the payment confirmation step.',
          '',
          '— Infact Solutions',
        ].join('\n'),
      });
    }

    return { ok: true, referenceId: record.id };
  } catch (err) {
    console.error('[donate] failed to record donation intent', err);
    return { ok: false, message: 'Something went wrong on our side. Please try again.' };
  }
}
