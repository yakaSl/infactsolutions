"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { portfolioItems, INDUSTRIES, type Industry } from '@/lib/portfolio-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight, Smartphone } from 'lucide-react';

type Filter = 'All' | Industry;

const FILTERS: Filter[] = ['All', ...INDUSTRIES];

export function PortfolioSection() {
  const [active, setActive] = useState<Filter>('All');

  const items =
    active === 'All'
      ? portfolioItems
      : portfolioItems.filter((item) => item.industry === active);

  return (
    <section id="portfolio" className="bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our Work</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Websites, web apps, and mobile products we've built across tourism, commerce,
            healthcare, media, mobility, and SaaS. Explore the work — then let's build yours.
          </p>
        </div>

        {/* Industry filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
                active === filter
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card
              key={item.slug}
              className="flex flex-col group overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-primary"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={`${item.title} — ${item.projectType}`}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/15 via-card to-background">
                    <Smartphone className="h-8 w-8 text-primary/70" />
                    <span className="text-xl font-bold tracking-tight text-foreground/80">
                      {item.title}
                    </span>
                  </div>
                )}
              </div>

              <CardContent className="p-5 flex flex-col flex-grow">
                <Badge variant="secondary" className="self-start mb-3">
                  {item.industry}
                </Badge>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm font-medium text-primary mb-3">{item.projectType}</p>
                <p className="text-sm text-muted-foreground mb-4">{item.summary}</p>

                <ul className="space-y-1.5 mb-5 text-sm text-muted-foreground">
                  {item.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {item.liveUrl ? (
                    <Button asChild variant="outline" className="w-full">
                      <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                        Visit Site <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Smartphone className="h-4 w-4" /> Mobile application
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Client-work CTA */}
        <div className="mt-16 rounded-2xl border border-border/50 bg-card p-8 md:p-12 text-center shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Have a project like these in mind?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            We build the complete system behind your business — website, app, dashboard,
            backend, and automation. Tell us what you're building.
          </p>
          <Button asChild size="lg">
            <Link href="/#contact">
              Start your project <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
