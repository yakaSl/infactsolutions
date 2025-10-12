"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { clientWorks } from '@/lib/client-works-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PastWorksSection() {
  const duplicatedWorks = [...clientWorks, ...clientWorks, ...clientWorks, ...clientWorks];

  return (
    <section id="past-works" className="bg-card py-16 sm:py-20 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our Clients</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We take pride in the solutions we've delivered for our clients across various industries.
          </p>
        </motion.div>
      </div>
      <div className="relative">
        <div className="flex animate-logo-reel">
          {duplicatedWorks.map((work, index) => (
            <div key={index} className="flex-shrink-0 w-80 px-4">
                <Card className="h-full flex flex-col group overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-primary">
                  <div className="relative aspect-video">
                    <Image
                      src={work.imageUrl}
                      alt={`Logo for client project featuring technologies like ${work.tags.join(', ')}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 p-4"
                      data-ai-hint={work.dataAiHint}
                    />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {work.tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
