'use server';

import { headers } from 'next/headers';
import { investorLeadSchema, type InvestorLeadFormValues } from '@/lib/contribution-schemas';
import { findContributionTarget } from '@/lib/contribution-targets';
import { saveInvestorLead } from '@/lib/server/storage';
import { sendEmail, adminNotificationAddress } from '@/lib/server/email';
import { rateLimit } from '@/lib/server/rate-limit';

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return h.get('x-real-ip') ?? 'unknown';
}

export interface InvestorActionResult {
  ok: boolean;
  referenceId?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function submitInvestorInterest(input: InvestorLeadFormValues): Promise<InvestorActionResult> {
  const rl = rateLimit(`invest:${await clientIp()}`, 5, 60_000);
  if (!rl.allowed) {
    return {
      ok: false,
      message: `Too many attempts. Please wait ${rl.retryAfterSeconds ?? 60}s and try again.`,
    };
  }

  const parsed = investorLeadSchema.safeParse(input);
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
    const record = await saveInvestorLead(data);
    const target = findContributionTarget(data.targetSlug);

    await sendEmail({
      to: adminNotificationAddress(),
      subject: `[Investor interest] ${data.fullName} — LKR ${data.amount.toLocaleString()} for ${target?.label ?? data.targetSlug}`,
      replyTo: data.email,
      text: [
        `Reference: ${record.id}`,
        `Target: ${target?.label ?? data.targetSlug} (${data.targetSlug})`,
        `Amount: LKR ${data.amount.toLocaleString()}`,
        `Investment type: ${data.investmentType}`,
        '',
        `Name: ${data.fullName}`,
        `Email: ${data.email}`,
        `WhatsApp: ${data.whatsapp}`,
        `Country: ${data.country}`,
        data.companyName ? `Company: ${data.companyName}` : '',
        data.nicOrPassport ? `NIC/Passport: ${data.nicOrPassport}` : '',
        data.linkedinUrl ? `LinkedIn / profile: ${data.linkedinUrl}` : '',
        '',
        'Message:',
        data.message,
        '',
        'Acknowledgements:',
        ` - No guaranteed return: ${data.acknowledgeNoGuarantee ? 'yes' : 'no'}`,
        ` - Will be contacted before funds accepted: ${data.acknowledgeContactFirst ? 'yes' : 'no'}`,
        ` - Consent to share details for review: ${data.acknowledgeShareDetails ? 'yes' : 'no'}`,
      ].filter(Boolean).join('\n'),
    });

    await sendEmail({
      to: data.email,
      subject: 'We received your investor interest — Infact Solutions',
      text: [
        `Hi ${data.fullName.split(' ')[0]},`,
        '',
        `Thank you for expressing interest in investing LKR ${data.amount.toLocaleString()} in ${target?.label ?? 'Infact Solutions'}.`,
        `Your reference number is: ${record.id}`,
        '',
        'Our team will review your submission and contact you with project details, legal documents, and next steps before accepting any funds.',
        '',
        '— Infact Solutions',
      ].join('\n'),
    });

    return { ok: true, referenceId: record.id };
  } catch (err) {
    console.error('[invest] failed to record investor lead', err);
    return { ok: false, message: 'Something went wrong on our side. Please try again.' };
  }
}
