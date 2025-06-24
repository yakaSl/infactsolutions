import { notFound } from 'next/navigation';
import { projects } from '@/lib/projects-data';
import { ProjectDetail } from '@/components/project-detail';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id.toString(),
  }));
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id.toString() === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
            <ProjectDetail project={project} />
        </main>
        <Footer />
    </div>
  );
}
