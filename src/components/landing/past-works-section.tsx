"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { clientWorks } from '@/lib/client-works-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PastWorksSection() {
  return (
    <section id="past-works" className="bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our Past Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We take pride in the solutions we've delivered for our clients across various industries.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clientWorks.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
            >
              <Card className="h-full flex flex-col group overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-primary">
                <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    <Image
                      src={work.imageUrl}
                      alt={work.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      data-ai-hint={work.dataAiHint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <Badge variant="secondary" className="self-start mb-2">{work.category}</Badge>
                  <CardTitle className="text-lg font-semibold mb-2">{work.title}</CardTitle>
                  <p className="text-muted-foreground text-sm mb-4 flex-grow text-justify">{work.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {work.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
