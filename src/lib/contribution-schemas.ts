import * as z from 'zod';
import { contributionTargets } from './contribution-targets';

const targetSlugs = contributionTargets.map((t) => t.slug) as [string, ...string[]];

export const DONATION_PRESET_AMOUNTS = [1000, 5000, 10000, 25000] as const;
export const INVESTMENT_PRESET_AMOUNTS = [100_000, 250_000, 500_000, 1_000_000] as const;

const MIN_DONATION = 500;
const MAX_DONATION = 10_000_000;
const MIN_INVESTMENT = 50_000;
const MAX_INVESTMENT = 1_000_000_000;

const trimmedString = (max = 500) =>
  z.string().trim().max(max);

const optionalString = (max = 500) =>
  trimmedString(max).optional().or(z.literal('').transform(() => undefined));

export const donationSchema = z.object({
  targetSlug: z.enum(targetSlugs),
  amount: z
    .number({ invalid_type_error: 'Amount is required.' })
    .int('Amount must be a whole number.')
    .min(MIN_DONATION, `Minimum donation is LKR ${MIN_DONATION.toLocaleString()}.`)
    .max(MAX_DONATION, `Maximum donation is LKR ${MAX_DONATION.toLocaleString()}.`),
  currency: z.literal('LKR'),
  donorMode: z.enum(['anonymous', 'named', 'detailed']),
  donorName: optionalString(120),
  donorEmail: z
    .string()
    .trim()
    .email('Please enter a valid email.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  publicDisplayName: optionalString(80),
  message: optionalString(2000),
});

export type DonationFormValues = z.infer<typeof donationSchema>;

export const INVESTMENT_TYPES = [
  { value: 'equity', label: 'Equity' },
  { value: 'loan', label: 'Loan' },
  { value: 'revenue-share', label: 'Revenue share' },
  { value: 'discuss', label: 'Discuss with team' },
] as const;

export const investorLeadSchema = z.object({
  targetSlug: z.enum(targetSlugs),
  amount: z
    .number({ invalid_type_error: 'Amount is required.' })
    .int('Amount must be a whole number.')
    .min(MIN_INVESTMENT, `Minimum investment is LKR ${MIN_INVESTMENT.toLocaleString()}.`)
    .max(MAX_INVESTMENT, `Maximum investment is LKR ${MAX_INVESTMENT.toLocaleString()}.`),
  currency: z.literal('LKR'),
  fullName: trimmedString(120).min(2, 'Full name is required.'),
  email: z.string().trim().email('Please enter a valid email.'),
  whatsapp: trimmedString(40).min(6, 'WhatsApp number is required.'),
  country: trimmedString(80).min(2, 'Country is required.'),
  investmentType: z.enum(['equity', 'loan', 'revenue-share', 'discuss']),
  message: trimmedString(4000).min(10, 'Please add a short message (10+ characters).'),
  companyName: optionalString(160),
  nicOrPassport: optionalString(60),
  linkedinUrl: optionalString(300),
  acknowledgeNoGuarantee: z.literal(true, {
    errorMap: () => ({ message: 'Required acknowledgement.' }),
  }),
  acknowledgeContactFirst: z.literal(true, {
    errorMap: () => ({ message: 'Required acknowledgement.' }),
  }),
  acknowledgeShareDetails: z.literal(true, {
    errorMap: () => ({ message: 'Required acknowledgement.' }),
  }),
});

export type InvestorLeadFormValues = z.infer<typeof investorLeadSchema>;
