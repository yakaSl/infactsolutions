'use server';

import { headers } from 'next/headers';
import { donationSchema, type DonationFormValues } from '@/lib/contribution-schemas';
import { findContributionTarget } from '@/lib/contribution-targets';
import {
  attachPaypalOrderId,
  createPendingContribution,
  findContributionByOrderId,
  getContribution,
  markContributionPaid,
  markContributionStatus,
  type SavedContribution,
} from '@/lib/server/storage';
import { sendEmail, adminNotificationAddress } from '@/lib/server/email';
import {
  PaypalApiError,
  PaypalConfigError,
  captureOrder,
  createOrder,
} from '@/lib/server/paypal';

export interface DonationActionResult {
  ok: boolean;
  approveUrl?: string;
  referenceId?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

async function resolveBaseUrl(): Promise<string> {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');
  const h = await headers();
  const host = h.get('host');
  const proto = h.get('x-forwarded-proto') ?? (host?.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export async function createDonationOrder(input: DonationFormValues): Promise<DonationActionResult> {
  const parsed = donationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Some fields are invalid. Please review and try again.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const data = parsed.data;
  const target = findContributionTarget(data.targetSlug);
  if (!target) {
    return { ok: false, message: 'Selected project is no longer available.' };
  }

  let contribution: SavedContribution;
  try {
    contribution = await createPendingContribution(data);
  } catch (err) {
    console.error('[donate] failed to create pending contribution', err);
    return { ok: false, message: 'Could not start the donation. Please try again.' };
  }

  try {
    const baseUrl = await resolveBaseUrl();
    const order = await createOrder({
      amountUsd: data.amount,
      referenceId: contribution.id,
      description: `Donation to ${target.label}`,
      returnUrl: `${baseUrl}/donate/return?ref=${contribution.id}`,
      cancelUrl: `${baseUrl}/donate/cancel?ref=${contribution.id}`,
    });
    await attachPaypalOrderId(contribution.id, order.orderId);
    return { ok: true, approveUrl: order.approveUrl, referenceId: contribution.id };
  } catch (err) {
    await markContributionStatus(contribution.id, 'failed').catch(() => undefined);
    if (err instanceof PaypalConfigError) {
      console.error('[donate] PayPal not configured', err);
      return {
        ok: false,
        message: 'PayPal is not configured on the server yet. Please contact us directly to donate.',
      };
    }
    if (err instanceof PaypalApiError) {
      console.error('[donate] PayPal createOrder failed', err.status, err.details);
      return { ok: false, message: 'PayPal could not start the payment. Please try again.' };
    }
    console.error('[donate] unexpected error creating PayPal order', err);
    return { ok: false, message: 'Something went wrong. Please try again.' };
  }
}

export interface CaptureResultUi {
  ok: boolean;
  status: 'paid' | 'pending' | 'failed';
  message?: string;
  referenceId?: string;
}

export async function captureDonationByReference(referenceId: string): Promise<CaptureResultUi> {
  const contribution = await getContribution(referenceId);
  if (!contribution || !contribution.paypalOrderId) {
    return { ok: false, status: 'failed', message: 'Donation reference not found.' };
  }
  if (contribution.status === 'paid') {
    return { ok: true, status: 'paid', referenceId: contribution.id };
  }
  return captureAndNotify(contribution);
}

export async function captureDonationByOrderId(orderId: string): Promise<CaptureResultUi> {
  const contribution = await findContributionByOrderId(orderId);
  if (!contribution) {
    return { ok: false, status: 'failed', message: 'Donation reference not found.' };
  }
  if (contribution.status === 'paid') {
    return { ok: true, status: 'paid', referenceId: contribution.id };
  }
  return captureAndNotify(contribution);
}

async function captureAndNotify(contribution: SavedContribution): Promise<CaptureResultUi> {
  if (!contribution.paypalOrderId) {
    return { ok: false, status: 'failed', message: 'No PayPal order associated with this donation.' };
  }
  try {
    const capture = await captureOrder(contribution.paypalOrderId);
    if (capture.status === 'COMPLETED' && capture.captureId) {
      await markContributionPaid(contribution.id, capture.captureId, capture.raw);
      await sendDonationEmails(contribution);
      return { ok: true, status: 'paid', referenceId: contribution.id };
    }
    if (capture.status === 'PENDING' || capture.status === 'APPROVED') {
      return { ok: true, status: 'pending', referenceId: contribution.id };
    }
    await markContributionStatus(contribution.id, 'failed');
    return { ok: false, status: 'failed', message: `Payment status: ${capture.status}` };
  } catch (err) {
    if (err instanceof PaypalConfigError) {
      console.error('[donate] PayPal not configured during capture', err);
      return { ok: false, status: 'failed', message: 'PayPal is not configured on the server.' };
    }
    if (err instanceof PaypalApiError) {
      console.error('[donate] capture failed', err.status, err.details);
      return { ok: false, status: 'failed', message: 'PayPal could not capture the payment.' };
    }
    console.error('[donate] unexpected capture error', err);
    return { ok: false, status: 'failed', message: 'Something went wrong while capturing the payment.' };
  }
}

async function sendDonationEmails(contribution: SavedContribution): Promise<void> {
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
