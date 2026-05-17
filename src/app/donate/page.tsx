import type { Metadata } from 'next';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { DonateForm } from './donate-form';

export const metadata: Metadata = {
  title: 'Support Our Projects',
  description:
    'Help us continue building innovative digital products. Support a specific Infact Solutions project or contribute to our general development fund.',
};

export default function DonatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Support Our Projects
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Help us continue building innovative digital products. You can support a specific
                project or contribute to our general development fund.
              </p>
            </div>
            <DonateForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
