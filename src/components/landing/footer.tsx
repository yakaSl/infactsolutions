import { Button } from '@/components/ui/button';
import { Linkedin, Facebook, Instagram, Heart, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// lucide-react has no TikTok brand mark, so provide a minimal inline icon.
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.4c-1.3.1-2.5-.3-3.5-.9v5.9a5.4 5.4 0 1 1-5.4-5.4c.2 0 .5 0 .7.1v2.5a2.9 2.9 0 1 0 2 2.8V3h2.7Z" />
    </svg>
  );
}

const socialLinks = [
  { label: 'LinkedIn', href: 'https://lk.linkedin.com/company/infact-solutions-pvt-ltd', Icon: Linkedin },
  { label: 'Facebook', href: 'https://www.facebook.com/infactsolutions/', Icon: Facebook },
  { label: 'Instagram', href: 'https://www.instagram.com/infactsolutions/', Icon: Instagram },
  { label: 'TikTok', href: 'https://www.tiktok.com/@infact.solutions', Icon: TikTokIcon },
] as const;

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
            {socialLinks.map(({ label, href, Icon }) => (
              <Button key={label} variant="ghost" size="icon" asChild>
                <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                  <Icon className="h-5 w-5" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
