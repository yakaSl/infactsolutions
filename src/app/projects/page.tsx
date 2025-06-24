import { Header } from '@/components/landing/header';
import { ProjectsSection } from '@/components/landing/projects-section';
import { Footer } from '@/components/landing/footer';

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
