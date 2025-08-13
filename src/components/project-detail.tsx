"use client";

import Image from 'next/image';
import { Project } from '@/lib/projects-data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, Rocket, CheckCircle, Circle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function ProjectDetail({ project }: { project: Project }) {
  const investmentProgress = (project.currentInvestment / project.expectedInvestment) * 100;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge variant="secondary" className="mb-2">{project.category}</Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">{project.title}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mb-8">{project.description}</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Prototype/Screenshots */}
          <Card className="overflow-hidden border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Prototype & Screenshots</CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {project.screenshots.map((src, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                        <Image src={src} alt={`${project.title} screenshot ${index + 1}`} fill className="object-cover" data-ai-hint="screenshot app"/>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>

          {/* Investment Slots */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Investment Slots</CardTitle>
              <CardDescription>
                {project.investmentSlots.length} slots available. 
                Each slot represents an investment of {formatCurrency(project.expectedInvestment / project.investmentSlots.length)}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                {project.investmentSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-center aspect-square rounded-md transition-all ${
                      slot.status === 'booked'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted hover:bg-accent'
                    }`}
                    title={`Slot ${index + 1}: ${slot.status}`}
                  >
                    {slot.status === 'booked' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="sticky top-24 border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle>Investment Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-primary text-2xl">
                    {formatCurrency(project.currentInvestment)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    raised of {formatCurrency(project.expectedInvestment)}
                  </span>
                </div>
                <Progress value={investmentProgress} className="h-3" />
                 <div className="text-right text-xs text-muted-foreground mt-1">
                  {investmentProgress.toFixed(0)}% Funded
                </div>
              </div>
              <div className="space-y-2">
                {project.websiteUrl && (
                    <Button size="lg" variant="outline" className="w-full" asChild>
                        <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                            <ExternalLink className="w-5 h-5" />
                            <span>Visit Website</span>
                        </a>
                    </Button>
                )}
                <Button size="lg" className="w-full" asChild>
                  <a href={project.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      <span>View Pitch Deck</span>
                  </a>
                </Button>
                <Button size="lg" variant="secondary" className="w-full">
                  <Rocket className="w-5 h-5" />
                  <span>Express Interest</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
