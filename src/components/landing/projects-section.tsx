"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const projects = [
  {
    id: 1,
    title: 'Project Alpha',
    category: 'Web Application',
    imageUrl: 'https://placehold.co/500x700.png',
    dataAiHint: 'dashboard analytics',
    description: 'A comprehensive enterprise resource planning (ERP) system designed for a major logistics company. This web application streamlined their operations, from inventory management to delivery tracking, resulting in a 30% increase in efficiency.'
  },
  {
    id: 2,
    title: 'E-commerce Platform',
    category: 'Mobile App',
    imageUrl: 'https://placehold.co/500x500.png',
    dataAiHint: 'shopping app',
    description: 'A sleek and user-friendly mobile e-commerce app for a fashion startup. Featuring AR try-on technology and personalized recommendations, it boosted user engagement and sales by 50% within the first six months.'
  },
  {
    id: 3,
    title: 'Data Vis Dashboard',
    category: 'Data Analytics',
    imageUrl: 'https://placehold.co/500x800.png',
    dataAiHint: 'data visualization',
    description: 'An interactive data visualization dashboard for a financial services firm, enabling real-time monitoring of market trends and portfolio performance. The intuitive interface made complex data accessible to non-technical stakeholders.'
  },
  {
    id: 4,
    title: 'Project Beta',
    category: 'Cloud Migration',
    imageUrl: 'https://placehold.co/500x600.png',
    dataAiHint: 'cloud infrastructure',
    description: 'Led the complete cloud migration for a healthcare provider to a secure and scalable AWS infrastructure. This project ensured HIPAA compliance, improved data accessibility for practitioners, and reduced operational costs.'
  },
  {
    id: 5,
    title: 'AI Chatbot',
    category: 'Artificial Intelligence',
    imageUrl: 'https://placehold.co/500x500.png',
    dataAiHint: 'chatbot interface',
    description: 'Developed an AI-powered customer service chatbot for a telecommunications company. It handles over 60% of customer inquiries, reducing wait times and freeing up human agents to focus on more complex issues.'
  },
  {
    id: 6,
    title: 'Brand Redesign',
    category: 'UI/UX Design',
    imageUrl: 'https://placehold.co/500x700.png',
    dataAiHint: 'brand identity',
    description: 'A complete brand identity and website redesign for a SaaS company. The new design system improved user experience, increased conversion rates, and created a modern, cohesive brand image across all platforms.'
  },
];

type Project = (typeof projects)[0];

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="works" className="bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A glimpse into the solutions we've crafted for our valued clients.
          </p>
        </div>

        <Dialog>
          <div className="sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {projects.map((project) => (
              <DialogTrigger key={project.id} asChild onClick={() => setSelectedProject(project)}>
                <div className="group relative overflow-hidden rounded-lg cursor-pointer break-inside-avoid shadow-lg">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={500}
                    height={700}
                    className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    data-ai-hint={project.dataAiHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 p-6 text-white transition-transform duration-500 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                    <h3 className="font-bold text-xl">{project.title}</h3>
                    <p className="text-sm text-primary">{project.category}</p>
                  </div>
                </div>
              </DialogTrigger>
            ))}
          </div>

          {selectedProject && (
            <DialogContent className="max-w-4xl bg-card border-border">
              <DialogHeader>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Image
                      src={selectedProject.imageUrl.replace(/500x\d+/, '800x600')}
                      alt={selectedProject.title}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={selectedProject.dataAiHint}
                    />
                  </div>
                  <div className="space-y-4">
                    <DialogTitle className="text-3xl font-bold text-primary">{selectedProject.title}</DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground">
                      {selectedProject.description}
                    </DialogDescription>
                    <Button>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Project
                    </Button>
                  </div>
                </div>
              </DialogHeader>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </section>
  );
}
