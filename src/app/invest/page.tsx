import type { Metadata } from 'next';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { InvestForm } from './invest-form';

export const metadata: Metadata = {
  title: 'Join as an Investor',
  description:
    'Invest in future-ready digital projects from Infact Solutions. Submit your interest and our team will review and contact you with project details, legal documents, and next steps.',
};

export default function InvestPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Invest in Future-Ready Digital Projects
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Submit your investment interest in selected Infact Solutions projects. Our team
                will review your request and contact you with project details, legal documents,
                and next steps before accepting any funds.
              </p>
            </div>
            <InvestForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
