import type { Metadata } from 'next';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { markContributionStatus, getContribution } from '@/lib/server/storage';

export const metadata: Metadata = {
  title: 'Donation cancelled',
  robots: { index: false, follow: false },
};

export default async function DonateCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  if (ref) {
    const existing = await getContribution(ref);
    if (existing && existing.status !== 'paid') {
      await markContributionStatus(ref, 'failed').catch(() => undefined);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="mx-auto max-w-xl">
            <Card>
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <XCircle className="h-7 w-7" />
                </div>
                <CardTitle>Donation cancelled</CardTitle>
                <CardDescription>
                  You cancelled the PayPal checkout. No payment was taken.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center gap-3">
                <Button asChild variant="outline"><Link href="/">Back to home</Link></Button>
                <Button asChild><Link href="/donate">Try again</Link></Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
