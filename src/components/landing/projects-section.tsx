"use client";

import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/projects-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function ProjectsSection() {
  return (
    <section id="projects" className="bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="text-center space-y-4 mb-12"
        >
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Projects</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A glimpse into the solutions we've crafted for our valued clients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
            >
              <Link href={`/projects/${project.id}`} className="block h-full">
                  <Card className="h-full flex flex-col group overflow-hidden cursor-pointer shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-primary">
                    <CardHeader className="p-0">
                      <div className="relative aspect-video">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          data-ai-hint={project.dataAiHint}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col flex-grow">
                      <Badge variant="secondary" className="self-start mb-2">{project.category}</Badge>
                      <CardTitle className="text-lg font-semibold mb-2 flex-grow">{project.title}</CardTitle>
                      <div className="space-y-3 mt-auto">
                        <Progress value={(project.currentInvestment / project.expectedInvestment) * 100} className="h-2" />
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-primary">
                            {formatCurrency(project.currentInvestment)}
                          </span>
                          <span className="text-muted-foreground">
                            raised of {formatCurrency(project.expectedInvestment)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
