import { randomUUID } from 'crypto';
import type { DonationFormValues, InvestorLeadFormValues } from '@/lib/contribution-schemas';

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
  data: DonationFormValues;
}

export interface SavedInvestorLead {
  id: string;
  status: InvestorLeadStatus;
  createdAt: string;
  data: InvestorLeadFormValues;
}

// TODO(phase-2): replace these in-memory stubs with Firestore writes
//   - install firebase-admin
//   - use a server-only Firestore client via service-account credentials
//   - collections: contributions, investorLeads, paypalWebhookEvents
const contributions: SavedContribution[] = [];
const investorLeads: SavedInvestorLead[] = [];

export async function saveDonationIntent(data: DonationFormValues): Promise<SavedContribution> {
  const record: SavedContribution = {
    id: randomUUID(),
    type: 'donation',
    status: 'pending',
    createdAt: new Date().toISOString(),
    data,
  };
  contributions.push(record);
  console.log('[storage] saved donation intent', {
    id: record.id,
    target: data.targetSlug,
    amount: data.amount,
    donorMode: data.donorMode,
  });
  return record;
}

export async function saveInvestorLead(data: InvestorLeadFormValues): Promise<SavedInvestorLead> {
  const record: SavedInvestorLead = {
    id: randomUUID(),
    status: 'new',
    createdAt: new Date().toISOString(),
    data,
  };
  investorLeads.push(record);
  console.log('[storage] saved investor lead', {
    id: record.id,
    target: data.targetSlug,
    amount: data.amount,
    email: data.email,
  });
  return record;
}
