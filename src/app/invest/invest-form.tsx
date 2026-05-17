'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

import { contributionTargets } from '@/lib/contribution-targets';
import {
  INVESTMENT_PRESET_AMOUNTS,
  INVESTMENT_TYPES,
  investorLeadSchema,
  type InvestorLeadFormValues,
} from '@/lib/contribution-schemas';
import { submitInvestorInterest } from './actions';

import { Stepper } from '@/components/contribute/stepper';
import { AmountPicker } from '@/components/contribute/amount-picker';
import { CheckCircle2 } from 'lucide-react';

const STEPS = ['Project', 'Amount', 'Your details', 'Acknowledge', 'Submit'];

export function InvestForm() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const form = useForm<InvestorLeadFormValues>({
    resolver: zodResolver(investorLeadSchema),
    mode: 'onTouched',
    defaultValues: {
      targetSlug: contributionTargets[0]?.slug ?? '',
      amount: undefined as unknown as number,
      currency: 'LKR',
      fullName: '',
      email: '',
      whatsapp: '',
      country: '',
      investmentType: 'discuss',
      message: '',
      companyName: '',
      nicOrPassport: '',
      linkedinUrl: '',
      acknowledgeNoGuarantee: false as unknown as true,
      acknowledgeContactFirst: false as unknown as true,
      acknowledgeShareDetails: false as unknown as true,
    },
  });

  async function next() {
    const fields: Array<keyof InvestorLeadFormValues> =
      step === 0 ? ['targetSlug']
      : step === 1 ? ['amount']
      : step === 2 ? ['fullName', 'email', 'whatsapp', 'country', 'investmentType', 'message', 'companyName', 'nicOrPassport', 'linkedinUrl']
      : step === 3 ? ['acknowledgeNoGuarantee', 'acknowledgeContactFirst', 'acknowledgeShareDetails']
      : [];
    if (fields.length) {
      const ok = await form.trigger(fields, { shouldFocus: true });
      if (!ok) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values: InvestorLeadFormValues) {
    const result = await submitInvestorInterest(values);
    if (result.ok && result.referenceId) {
      setSubmittedRef(result.referenceId);
      toast({
        title: 'Submitted',
        description: 'Your investor interest was recorded. Reference ' + result.referenceId,
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Could not submit',
        description: result.message ?? 'Please review the form and try again.',
      });
      if (result.fieldErrors) {
        for (const [name, errs] of Object.entries(result.fieldErrors)) {
          if (errs?.[0]) {
            form.setError(name as keyof InvestorLeadFormValues, { type: 'server', message: errs[0] });
          }
        }
      }
    }
  }

  if (submittedRef) {
    return (
      <Card className="bg-card border-border/50 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <CardTitle>Thank you — your interest has been recorded</CardTitle>
          <CardDescription>
            Reference: <span className="font-mono">{submittedRef}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Our team will review your submission and contact you with project details, legal
            documents, and next steps before accepting any funds.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSubmittedRef(null);
              setStep(0);
            }}
          >
            Submit another interest
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50 shadow-xl">
      <CardHeader className="space-y-4">
        <div>
          <CardTitle>Join as an Investor</CardTitle>
          <CardDescription>
            Submit your investment interest in selected Infact Solutions projects. Our team will
            review your request and contact you with project details, legal documents, and next
            steps before accepting any funds.
          </CardDescription>
        </div>
        <Stepper steps={STEPS} current={step} />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            {step === 0 && (
              <FormField
                control={form.control}
                name="targetSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select project</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contributionTargets.map((t) => (
                          <SelectItem key={t.slug} value={t.slug}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step === 1 && (
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select investment amount</FormLabel>
                    <FormControl>
                      <AmountPicker
                        presets={INVESTMENT_PRESET_AMOUNTS}
                        value={field.value}
                        onChange={field.onChange}
                        minCustom={50_000}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp number</FormLabel>
                        <FormControl><Input placeholder="+94 ..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl><Input placeholder="Sri Lanka" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="investmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred investment type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select one" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INVESTMENT_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Briefly tell us about your interest, timeline, and any questions."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="rounded-md border border-dashed p-4 space-y-4">
                  <p className="text-sm font-medium">Optional details</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nicOrPassport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIC / Passport number</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn or profile URL</FormLabel>
                        <FormControl><Input placeholder="https://www.linkedin.com/in/..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    Proof-of-funds or other documents can be shared later, not on this form.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {[
                  { name: 'acknowledgeNoGuarantee' as const, label: 'I understand this is not a guaranteed-return investment.' },
                  { name: 'acknowledgeContactFirst' as const, label: 'I understand Infact Solutions will contact me before accepting funds.' },
                  { name: 'acknowledgeShareDetails' as const, label: 'I agree to share my details for investment review.' },
                ].map((row) => (
                  <FormField
                    key={row.name}
                    control={form.control}
                    name={row.name}
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3 rounded-md border p-3">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={(v) => field.onChange(v === true)}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-sm font-normal leading-relaxed">
                            {row.label}
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}

            {step === 4 && <InvestorReview values={form.getValues()} />}

            <div className="flex items-center justify-between pt-2">
              <Button type="button" variant="outline" onClick={back} disabled={step === 0}>
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={next}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Submitting...' : 'Submit interest'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function InvestorReview({ values }: { values: InvestorLeadFormValues }) {
  const target = contributionTargets.find((t) => t.slug === values.targetSlug);
  const typeLabel = INVESTMENT_TYPES.find((t) => t.value === values.investmentType)?.label ?? values.investmentType;
  const rows: Array<[string, string]> = [
    ['Project', target?.label ?? values.targetSlug],
    ['Amount', `LKR ${(values.amount ?? 0).toLocaleString()}`],
    ['Investment type', typeLabel],
    ['Name', values.fullName],
    ['Email', values.email],
    ['WhatsApp', values.whatsapp],
    ['Country', values.country],
  ];
  if (values.companyName) rows.push(['Company', values.companyName]);
  if (values.nicOrPassport) rows.push(['NIC/Passport', values.nicOrPassport]);
  if (values.linkedinUrl) rows.push(['Profile URL', values.linkedinUrl]);
  rows.push(['Message', values.message]);

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">Review and submit</h3>
      <dl className="divide-y divide-border rounded-md border">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-2 px-4 py-2 text-sm">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="col-span-2 break-words">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-muted-foreground">
        Submitting this form does not transfer any money. We will contact you before accepting any funds.
      </p>
    </div>
  );
}
