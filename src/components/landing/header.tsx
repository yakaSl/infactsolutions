"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const navLinks = [
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { id: 'testimonials', label: 'Testimonials' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLinksContent = () => (
    <>
      {navLinks.map((link) => (
        link.href ? (
          <Button key={link.label} variant="link" asChild className="text-foreground hover:text-primary transition-colors text-base">
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ) : (
          <Button key={link.id!} variant="link" onClick={() => scrollToSection(link.id!)} className="text-foreground hover:text-primary transition-colors text-base">
            {link.label}
          </Button>
        )
      ))}
      <Button onClick={() => scrollToSection('contact')} className="ml-2">Get in Touch</Button>
    </>
  );

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-sm border-b' : 'bg-transparent'}`}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
          <Image src="https://placehold.co/400x60.png" alt="INFACT SOLUTIONS Logo" width={400} height={60} data-ai-hint="logo" />
        </div>
        <nav className="hidden md:flex items-center gap-2">
          <NavLinksContent />
        </nav>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex flex-col items-center gap-6">
                  {navLinks.map((link) => (
                    link.href ? (
                      <Button key={link.label} variant="link" asChild className="text-foreground text-xl">
                        <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>{link.label}</Link>
                      </Button>
                    ) : (
                      <Button key={link.id!} variant="link" onClick={() => scrollToSection(link.id!)} className="text-foreground text-xl">
                        {link.label}
                      </Button>
                    )
                  ))}
                  <Button onClick={() => scrollToSection('contact')} className="mt-4">Get in Touch</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
