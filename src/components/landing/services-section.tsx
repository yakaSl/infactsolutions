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
  return (
    <section id="services" className="bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">What We Do</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We offer a comprehensive suite of services to build, deploy, and scale exceptional digital experiences.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="bg-background border-border/50 hover:border-primary hover:scale-[1.02] transition-all duration-300 shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <service.icon className="h-10 w-10 text-primary" />
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{service.description}</p>
                <Button variant="link" className="p-0">Learn More &rarr;</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
