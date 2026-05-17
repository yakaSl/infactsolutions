import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Github, Heart, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/donate" className="gap-2">
              <Heart className="h-4 w-4" />
              Donate
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/invest" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Join as Investor
            </Link>
          </Button>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="INFACT Solutions - IT and Cybersecurity Company Logo" width={180} height={48} />
          </Link>
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} INFACT SOLUTIONS. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
