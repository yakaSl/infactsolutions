import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { AboutSection } from '@/components/landing/about-section';
import { ServicesSection } from '@/components/landing/services-section';
import { ProjectsSection } from '@/components/landing/projects-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { ContactSection } from '@/components/landing/contact-section';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
