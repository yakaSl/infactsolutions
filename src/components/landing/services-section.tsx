"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Smartphone, Cloud, BarChart, Bot, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: Code,
    title: 'Custom Software Development',
    description: 'Bespoke software solutions tailored to your unique business needs, from enterprise applications to specialized tools.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    description: 'Engaging and high-performance native and cross-platform mobile apps for both iOS and Android.',
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    description: 'Scalable cloud infrastructure, CI/CD pipelines, and automation to accelerate your development lifecycle.',
  },
  {
    icon: BarChart,
    title: 'Data Analytics & BI',
    description: 'Unlock insights from your data with our business intelligence solutions, dashboards, and predictive analytics.',
  },
  {
    icon: Bot,
    title: 'AI & Machine Learning',
    description: 'Integrate intelligent automation and predictive capabilities into your systems with our AI/ML expertise.',
  },
  {
    icon: ShieldCheck,
    title: 'Cybersecurity Consulting',
    description: 'Protect your digital assets with our comprehensive security audits, strategies, and implementation services.',
  },
];

export function ServicesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section id="services" className="bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">What We Do</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We offer a comprehensive suite of services to build, deploy, and scale exceptional digital experiences.
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="bg-background border-border/50 hover:border-primary transition-colors duration-300 shadow-lg h-full flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                  <service.icon className="h-10 w-10 text-primary" />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex flex-col flex-grow">
                  <p className="text-muted-foreground flex-grow">{service.description}</p>
                  <Button variant="link" className="p-0 self-start">Learn More &rarr;</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
