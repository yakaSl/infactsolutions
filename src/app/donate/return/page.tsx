import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { captureDonationByOrderId, captureDonationByReference } from '../actions';

export const metadata: Metadata = {
  title: 'Donation status',
  robots: { index: false, follow: false },
};

interface SearchParams {
  ref?: string;
  token?: string;
  PayerID?: string;
}

export default async function DonateReturnPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const ref = params.ref?.trim();
  const orderId = params.token?.trim();

  let result: Awaited<ReturnType<typeof captureDonationByReference>> | null = null;
  if (ref) {
    result = await captureDonationByReference(ref);
  } else if (orderId) {
    result = await captureDonationByOrderId(orderId);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="mx-auto max-w-xl">
            <ResultCard result={result} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ResultCard({
  result,
}: {
  result: Awaited<ReturnType<typeof captureDonationByReference>> | null;
}) {
  if (!result) {
    return (
      <Card>
        <CardHeader className="text-center space-y-2">
          <Icon variant="error" />
          <CardTitle>Missing donation reference</CardTitle>
          <CardDescription>
            We could not find a donation to confirm. Please start again.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild><Link href="/donate">Back to donate</Link></Button>
        </CardContent>
      </Card>
    );
  }

  if (result.status === 'paid') {
    return (
      <Card>
        <CardHeader className="text-center space-y-2">
          <Icon variant="success" />
          <CardTitle>Thank you for your donation</CardTitle>
          <CardDescription>
            Your payment was received. Reference:{' '}
            <span className="font-mono">{result.referenceId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-3">
          <Button asChild variant="outline"><Link href="/">Back to home</Link></Button>
          <Button asChild><Link href="/donate">Make another donation</Link></Button>
        </CardContent>
      </Card>
    );
  }

  if (result.status === 'pending') {
    return (
      <Card>
        <CardHeader className="text-center space-y-2">
          <Icon variant="pending" />
          <CardTitle>Payment is pending</CardTitle>
          <CardDescription>
            PayPal has not yet finalised your payment. We will email you once it completes.
            Reference: <span className="font-mono">{result.referenceId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild><Link href="/">Back to home</Link></Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center space-y-2">
        <Icon variant="error" />
        <CardTitle>Payment could not be completed</CardTitle>
        <CardDescription>{result.message ?? 'Please try again.'}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center gap-3">
        <Button asChild variant="outline"><Link href="/">Back to home</Link></Button>
        <Button asChild><Link href="/donate">Try again</Link></Button>
      </CardContent>
    </Card>
  );
}

function Icon({ variant }: { variant: 'success' | 'pending' | 'error' }) {
  const palette = {
    success: 'bg-primary/10 text-primary',
    pending: 'bg-amber-500/10 text-amber-500',
    error: 'bg-destructive/10 text-destructive',
  }[variant];
  const Component = variant === 'success' ? CheckCircle2 : variant === 'pending' ? Clock : AlertCircle;
  return (
    <div className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${palette}`}>
      <Component className="h-7 w-7" />
    </div>
  );
}
