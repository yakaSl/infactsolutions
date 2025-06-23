"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Johnson',
    company: 'CEO, Tech Innovators Inc.',
    quote: 'INFACT SOLUTIONS transformed our operations. Their custom software is the backbone of our success, and their team felt like a true extension of ours. Unparalleled expertise and dedication.',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
    initials: 'SJ',
  },
  {
    name: 'Michael Chen',
    company: 'CTO, FutureGadget Corp.',
    quote: "The mobile app they developed for us exceeded all expectations. It's sleek, fast, and our users love it. Their attention to detail in both UI and UX is simply outstanding.",
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
    initials: 'MC',
  },
  {
    name: 'Emily Rodriguez',
    company: 'Marketing Director, Connectify',
    quote: 'From data analytics to a full rebrand, INFACT has been our go-to partner. They don\'t just deliver services; they deliver results that have a real impact on the bottom line.',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman smiling',
    initials: 'ER',
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 7000);
    return () => clearInterval(timer);
  }, [nextTestimonial]);

  const { name, company, quote, avatar, initials, dataAiHint } = testimonials[currentIndex];

  return (
    <section id="testimonials" className="bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Trusted by Industry Leaders</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say.
          </p>
        </div>
        <Card className="max-w-4xl mx-auto bg-background p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center absolute top-4 right-4 md:top-8 md:right-8">
            <Button variant="ghost" size="icon" onClick={prevTestimonial} className="mr-2 rounded-full">
              <ChevronLeft />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextTestimonial} className="rounded-full">
              <ChevronRight />
            </Button>
          </div>
          <CardContent className="p-0 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <Avatar className="w-24 h-24 mb-6 border-4 border-primary">
                  <AvatarImage src={avatar} alt={name} data-ai-hint={dataAiHint} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <blockquote className="text-xl md:text-2xl font-medium italic mb-6">
                  "{quote}"
                </blockquote>
                <div className="font-bold text-lg text-primary">{name}</div>
                <div className="text-muted-foreground">{company}</div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
