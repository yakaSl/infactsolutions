"use client";

import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function HeroSection() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    return (
        <section id="hero" className="relative h-screen w-full">
            <Image 
                src="/home.jpg" 
                alt="Abstract technology background representing global IT solutions"
                fill
                priority
                className="object-cover"
                data-ai-hint="abstract technology"
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter">
                    Global IT, Cybersecurity & Software Development Partner
                </h1>
                <p className="mt-4 max-w-2xl text-base md:text-xl text-foreground/80">
                    Empowering businesses worldwide with secure networking, cybersecurity, and custom web & mobile app development. Your trusted global IT outsourcing partner for scalable and secure digital solutions.
                </p>
                <Button size="lg" className="mt-8 text-lg" onClick={() => scrollToSection('contact')}>
                    Secure Your Consultation
                </Button>
            </div>
        </section>
    );
}
