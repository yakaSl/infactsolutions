'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

import { contributionTargets } from '@/lib/contribution-targets';
import {
  DONATION_PRESET_AMOUNTS,
  donationSchema,
  type DonationFormValues,
} from '@/lib/contribution-schemas';
import { createDonationOrder } from './actions';

import { Stepper } from '@/components/contribute/stepper';
import { AmountPicker } from '@/components/contribute/amount-picker';

const STEPS = ['Project', 'Amount', 'Donor', 'Pay'];

export function DonateForm() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [redirecting, setRedirecting] = useState(false);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    mode: 'onTouched',
    defaultValues: {
      targetSlug: contributionTargets[0]?.slug ?? '',
      amount: undefined as unknown as number,
      currency: 'USD',
      donorMode: 'named',
      donorName: '',
      donorEmail: '',
      publicDisplayName: '',
      message: '',
    },
  });

  const donorMode = form.watch('donorMode');

  async function next() {
    const fields: Array<keyof DonationFormValues> =
      step === 0 ? ['targetSlug']
      : step === 1 ? ['amount']
      : step === 2 ? ['donorMode', 'donorName', 'donorEmail', 'publicDisplayName', 'message']
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

  async function onSubmit(values: DonationFormValues) {
    const result = await createDonationOrder(values);
    if (result.ok && result.approveUrl) {
      setRedirecting(true);
      window.location.href = result.approveUrl;
      return;
    }
    toast({
      variant: 'destructive',
      title: 'Could not start payment',
      description: result.message ?? 'Please review the form and try again.',
    });
    if (result.fieldErrors) {
      for (const [name, errs] of Object.entries(result.fieldErrors)) {
        if (errs?.[0]) {
          form.setError(name as keyof DonationFormValues, { type: 'server', message: errs[0] });
        }
      }
    }
  }

  return (
    <Card className="bg-card border-border/50 shadow-xl">
      <CardHeader className="space-y-4">
        <div>
          <CardTitle>Support Our Projects</CardTitle>
          <CardDescription>
            Help us continue building innovative digital products. Donations are processed in USD
            via PayPal.
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
                    <FormLabel>Select donation target</FormLabel>
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
                    <FormLabel>Select amount (USD)</FormLabel>
                    <FormControl>
                      <AmountPicker
                        presets={DONATION_PRESET_AMOUNTS}
                        value={field.value}
                        onChange={field.onChange}
                        currencyLabel="USD"
                        minCustom={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step === 2 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="donorMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How would you like to donate?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="space-y-2"
                        >
                          {[
                            { v: 'anonymous', t: 'Donate anonymously', d: 'Your name will not be displayed publicly. PayPal transaction details are still stored privately for accounting and compliance.' },
                            { v: 'named', t: 'Donate with my name' },
                            { v: 'detailed', t: 'Donate with donor details (we will email a receipt)' },
                          ].map((opt) => (
                            <label
                              key={opt.v}
                              className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-accent/30"
                            >
                              <RadioGroupItem value={opt.v} className="mt-1" />
                              <div className="space-y-1">
                                <div className="text-sm font-medium">{opt.t}</div>
                                {opt.d && (
                                  <div className="text-xs text-muted-foreground">{opt.d}</div>
                                )}
                              </div>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {donorMode !== 'anonymous' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="donorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name (optional)</FormLabel>
                          <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="publicDisplayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Public display name (optional)</FormLabel>
                          <FormControl><Input placeholder="How to credit you publicly" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {donorMode === 'detailed' && (
                  <FormField
                    control={form.control}
                    name="donorEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email for receipt</FormLabel>
                        <FormControl><Input type="email" placeholder="email@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A short note to the team"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 3 && (
              <DonationReview values={form.getValues()} />
            )}

            <div className="flex items-center justify-between pt-2">
              <Button type="button" variant="outline" onClick={back} disabled={step === 0 || redirecting}>
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={next}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={form.formState.isSubmitting || redirecting}>
                  {redirecting
                    ? 'Redirecting to PayPal...'
                    : form.formState.isSubmitting
                      ? 'Starting payment...'
                      : 'Continue to PayPal'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function DonationReview({ values }: { values: DonationFormValues }) {
  const target = contributionTargets.find((t) => t.slug === values.targetSlug);
  const rows: Array<[string, string]> = [
    ['Project', target?.label ?? values.targetSlug],
    ['Amount', `USD ${(values.amount ?? 0).toFixed(2)}`],
    ['Donor mode', values.donorMode],
  ];
  if (values.donorMode !== 'anonymous') {
    if (values.donorName) rows.push(['Name', values.donorName]);
    if (values.publicDisplayName) rows.push(['Public name', values.publicDisplayName]);
  }
  if (values.donorMode === 'detailed' && values.donorEmail) {
    rows.push(['Email', values.donorEmail]);
  }
  if (values.message) rows.push(['Message', values.message]);

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">Review and continue</h3>
      <dl className="divide-y divide-border rounded-md border">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-2 px-4 py-2 text-sm">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="col-span-2 break-words">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-muted-foreground">
        Clicking Continue redirects you to PayPal to complete the payment securely.
      </p>
    </div>
  );
}
