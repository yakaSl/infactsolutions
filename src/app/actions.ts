'use server';

import { headers } from 'next/headers';
import { contactFormSchema, type ContactFormValues } from '@/lib/contact-schema';
import { saveContactMessage } from '@/lib/server/storage';
import { sendContactMessageEmails } from '@/lib/server/contact-notify';
import { rateLimit } from '@/lib/server/rate-limit';

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return h.get('x-real-ip') ?? 'unknown';
}

export interface ContactActionResult {
  success: boolean;
  referenceId?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function submitContactForm(input: ContactFormValues): Promise<ContactActionResult> {
  const rl = rateLimit(`contact:${await clientIp()}`, 5, 60_000);
  if (!rl.allowed) {
    return {
      success: false,
      message: `Too many attempts. Please wait ${rl.retryAfterSeconds ?? 60}s and try again.`,
    };
  }

  const parsed = contactFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Some fields are invalid. Please review and try again.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

  try {
    const record = await saveContactMessage(data);
    await sendContactMessageEmails(record);
    return { success: true, referenceId: record.id };
  } catch (err) {
    console.error('[contact] failed to record contact message', err);
    return { success: false, message: 'Something went wrong on our side. Please try again.' };
  }
}
