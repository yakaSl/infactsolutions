import { randomUUID } from 'crypto';
import type { DonationFormValues, InvestorLeadFormValues } from '@/lib/contribution-schemas';
import { getFirestoreDb } from './firebase';
import { FieldValue, Timestamp, type Firestore } from 'firebase-admin/firestore';

export type ContributionStatus =
  | 'pending'
  | 'paypal_created'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'review_required';

export type InvestorLeadStatus =
  | 'new'
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'agreement_sent'
  | 'paid';

export interface SavedContribution {
  id: string;
  type: 'donation';
  status: ContributionStatus;
  createdAt: string;
  updatedAt: string;
  data: DonationFormValues;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  paypalRawCapture?: unknown;
}

export interface SavedInvestorLead {
  id: string;
  status: InvestorLeadStatus;
  createdAt: string;
  data: InvestorLeadFormValues;
}

export interface WebhookEventRecord {
  eventId: string;
  eventType: string;
  resourceId?: string;
  verified: boolean;
  receivedAt: string;
}

const CONTRIBUTIONS = 'contributions';
const INVESTOR_LEADS = 'investorLeads';
const WEBHOOK_EVENTS = 'paypalWebhookEvents';

// --- in-memory fallback (used when Firestore is not configured) ---
const memContributions = new Map<string, SavedContribution>();
const memInvestorLeads = new Map<string, SavedInvestorLead>();
const memWebhookEvents = new Map<string, WebhookEventRecord>();

// The in-memory fallback is only acceptable in local dev. In production a missing
// Firestore means submissions would be silently lost (and not shared across Cloud
// Run instances), so persistence-creating calls must fail closed instead.
class PersistenceUnavailableError extends Error {}

function requireDbInProduction(db: Firestore | null): void {
  if (!db && process.env.NODE_ENV === 'production') {
    throw new PersistenceUnavailableError(
      'Firestore is not configured; refusing to accept submissions in production.'
    );
  }
}

function toIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return value;
  return new Date().toISOString();
}

function contributionFromDoc(id: string, raw: Record<string, unknown>): SavedContribution {
  return {
    id,
    type: 'donation',
    status: (raw.status as ContributionStatus) ?? 'pending',
    createdAt: toIso(raw.createdAt),
    updatedAt: toIso(raw.updatedAt ?? raw.createdAt),
    data: raw.data as DonationFormValues,
    paypalOrderId: (raw.paypalOrderId as string | undefined) ?? undefined,
    paypalCaptureId: (raw.paypalCaptureId as string | undefined) ?? undefined,
    paypalRawCapture: raw.paypalRawCapture,
  };
}

function investorLeadFromDoc(id: string, raw: Record<string, unknown>): SavedInvestorLead {
  return {
    id,
    status: (raw.status as InvestorLeadStatus) ?? 'new',
    createdAt: toIso(raw.createdAt),
    data: raw.data as InvestorLeadFormValues,
  };
}

// --- donations ---

export async function createPendingContribution(data: DonationFormValues): Promise<SavedContribution> {
  const id = randomUUID();
  const nowIso = new Date().toISOString();
  const record: SavedContribution = {
    id,
    type: 'donation',
    status: 'pending',
    createdAt: nowIso,
    updatedAt: nowIso,
    data,
  };

  const db = getFirestoreDb();
  requireDbInProduction(db);
  if (db) {
    await db.collection(CONTRIBUTIONS).doc(id).set({
      type: 'donation',
      status: 'pending',
      data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } else {
    memContributions.set(id, record);
  }

  console.log('[storage] created pending contribution', { id, target: data.targetSlug, amount: data.amount });
  return record;
}

export async function attachPaypalOrderId(contributionId: string, orderId: string): Promise<void> {
  const db = getFirestoreDb();
  if (db) {
    await db.collection(CONTRIBUTIONS).doc(contributionId).update({
      paypalOrderId: orderId,
      status: 'paypal_created',
      updatedAt: FieldValue.serverTimestamp(),
    });
    return;
  }
  const existing = memContributions.get(contributionId);
  if (existing) {
    existing.paypalOrderId = orderId;
    existing.status = 'paypal_created';
    existing.updatedAt = new Date().toISOString();
  }
}

export async function findContributionByOrderId(orderId: string): Promise<SavedContribution | null> {
  const db = getFirestoreDb();
  if (db) {
    const snap = await db.collection(CONTRIBUTIONS).where('paypalOrderId', '==', orderId).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return contributionFromDoc(doc.id, doc.data());
  }
  for (const c of memContributions.values()) {
    if (c.paypalOrderId === orderId) return c;
  }
  return null;
}

export async function getContribution(id: string): Promise<SavedContribution | null> {
  const db = getFirestoreDb();
  if (db) {
    const doc = await db.collection(CONTRIBUTIONS).doc(id).get();
    if (!doc.exists) return null;
    return contributionFromDoc(doc.id, doc.data() ?? {});
  }
  return memContributions.get(id) ?? null;
}

export async function markContributionPaid(
  contributionId: string,
  captureId: string,
  rawCapture: unknown
): Promise<void> {
  const db = getFirestoreDb();
  if (db) {
    await db.collection(CONTRIBUTIONS).doc(contributionId).update({
      status: 'paid',
      paypalCaptureId: captureId,
      paypalRawCapture: rawCapture,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return;
  }
  const existing = memContributions.get(contributionId);
  if (existing) {
    existing.status = 'paid';
    existing.paypalCaptureId = captureId;
    existing.paypalRawCapture = rawCapture;
    existing.updatedAt = new Date().toISOString();
  }
}

export async function markContributionStatus(
  contributionId: string,
  status: ContributionStatus
): Promise<void> {
  const db = getFirestoreDb();
  if (db) {
    await db.collection(CONTRIBUTIONS).doc(contributionId).update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return;
  }
  const existing = memContributions.get(contributionId);
  if (existing) {
    existing.status = status;
    existing.updatedAt = new Date().toISOString();
  }
}

// --- investor leads ---

export async function saveInvestorLead(data: InvestorLeadFormValues): Promise<SavedInvestorLead> {
  const id = randomUUID();
  const nowIso = new Date().toISOString();
  const record: SavedInvestorLead = {
    id,
    status: 'new',
    createdAt: nowIso,
    data,
  };

  const db = getFirestoreDb();
  requireDbInProduction(db);
  if (db) {
    await db.collection(INVESTOR_LEADS).doc(id).set({
      status: 'new',
      data,
      createdAt: FieldValue.serverTimestamp(),
    });
  } else {
    memInvestorLeads.set(id, record);
  }

  console.log('[storage] saved investor lead', { id, target: data.targetSlug, amount: data.amount });
  return record;
}

// --- webhook event dedupe ---

/**
 * Returns true if this is the first time we have seen this event id.
 * Returns false if the event was already processed (caller should no-op).
 */
export async function recordWebhookEventIfNew(event: WebhookEventRecord): Promise<boolean> {
  const db = getFirestoreDb();
  if (db) {
    const ref = db.collection(WEBHOOK_EVENTS).doc(event.eventId);
    const existing = await ref.get();
    if (existing.exists) return false;
    await ref.set({
      eventId: event.eventId,
      eventType: event.eventType,
      resourceId: event.resourceId,
      verified: event.verified,
      receivedAt: FieldValue.serverTimestamp(),
    });
    return true;
  }
  if (memWebhookEvents.has(event.eventId)) return false;
  memWebhookEvents.set(event.eventId, event);
  return true;
}

// Re-export for convenience (unused locally but useful for admin pages in a later pass).
export { investorLeadFromDoc, contributionFromDoc };
