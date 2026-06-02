import type { Metadata } from 'next';
import { Header } from '@/components/landing/header';
import { PortfolioSection } from '@/components/landing/portfolio-section';
import { Footer } from '@/components/landing/footer';

export const metadata: Metadata = {
  title: 'Portfolio | Infact Solutions',
  description:
    'Websites, web apps, and mobile products built by Infact Solutions across tourism, commerce, healthcare, media, mobility, and SaaS.',
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <PortfolioSection />
      </main>
      <Footer />
    </div>
  );
}
