"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Smartphone, Cloud, BarChart, Bot, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: Code,
    title: 'Custom Software Development',
    description: 'We craft bespoke software solutions tailored to your unique business needs, from complex enterprise applications to specialized digital tools that drive efficiency and growth.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    description: 'Our team develops engaging and high-performance native and cross-platform mobile apps for both iOS and Android, designed to deliver a seamless user experience.',
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    description: 'Leverage our expertise to build scalable cloud infrastructure, implement CI/CD pipelines, and automate workflows to accelerate your development and deployment lifecycle.',
  },
  {
    icon: BarChart,
    title: 'Data Analytics & BI',
    description: 'Unlock actionable insights from your data with our advanced business intelligence solutions, including custom dashboards and predictive analytics to inform your strategy.',
  },
  {
    icon: Bot,
    title: 'AI & Machine Learning',
    description: 'Integrate intelligent automation, predictive capabilities, and data-driven features into your systems with our end-to-end AI and machine learning development services.',
  },
  {
    icon: ShieldCheck,
    title: 'Cybersecurity Consulting',
    description: 'Protect your digital assets with our comprehensive security services, including vulnerability assessments, penetration testing, and strategic implementation of defense systems.',
  },
];

export function ServicesSection() {

  return (
    <section id="services" className="bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">What We Do</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We build the system behind your business — websites, web applications, mobile apps, cloud backends, AI tools, and security. Our expert teams deliver at every stage: discovering your business model, then designing, building, securing, launching, and improving the product over the long term.
          </p>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <div
              key={service.title}
              className="h-full"
            >
              <Card className="bg-background border-border/50 hover:border-primary transition-colors duration-300 shadow-lg h-full flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                  <service.icon className="h-10 w-10 text-primary" />
                  <CardTitle as="h3" className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex flex-col flex-grow">
                  <p className="text-muted-foreground flex-grow">{service.description}</p>
                  <Button variant="link" className="p-0 self-start">Learn More &rarr;</Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
