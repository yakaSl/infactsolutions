import type { Metadata } from 'next';
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

// Keep meta descriptions readable in SERPs (~155 chars) without cutting mid-word.
function truncate(text: string, max = 155): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const project = projects.find((p) => p.id.toString() === params.id);
  if (!project) {
    return { title: 'Project not found' };
  }
  const canonical = `/projects/${project.id}`;
  const description = truncate(project.description);
  return {
    title: project.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${project.title} | INFACT SOLUTIONS`,
      description,
      url: canonical,
      type: 'article',
      images: [{ url: project.imageUrl, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | INFACT SOLUTIONS`,
      description,
      images: [project.imageUrl],
    },
  };
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
