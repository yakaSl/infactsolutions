import type { Metadata } from 'next';
import { Header } from '@/components/landing/header';
import { ProjectsSection } from '@/components/landing/projects-section';
import { Footer } from '@/components/landing/footer';

export const metadata: Metadata = {
  title: 'Investment Opportunities — Our Projects',
  description:
    'Explore active startup and SaaS projects open for investment from INFACT SOLUTIONS — from EdTech and PropTech to travel and event platforms.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Investment Opportunities — Our Projects | INFACT SOLUTIONS',
    description:
      'Explore active startup and SaaS projects open for investment from INFACT SOLUTIONS.',
    url: '/projects',
    type: 'website',
  },
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  );
}
