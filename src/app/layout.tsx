import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://infactsolutions.net'),
  title: {
    default: 'Infact Solutions — Global IT, Cybersecurity & Software Development Partner',
    template: '%s | INFACT SOLUTIONS',
  },
  description: 'Empowering businesses worldwide with secure networking, cybersecurity, and custom web & mobile app development.',
  openGraph: {
    title: 'Infact Solutions: Building Secure & Scalable Digital Solutions Globally',
    description: 'Empowering businesses worldwide with secure networking, cybersecurity, and custom web & mobile app development.',
    url: 'https://infactsolutions.net',
    siteName: 'INFACT SOLUTIONS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'INFACT SOLUTIONS - Global IT and Cybersecurity Partner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infact Solutions — Global IT, Cybersecurity & Software Development Partner',
    description: 'Empowering businesses worldwide with secure networking, cybersecurity, and custom web & mobile app development.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://infactsolutions.net/',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark scroll-smooth`}>
      <head>
        <link rel="alternate" href="https://infactsolutions.net/" hrefLang="en" />
        <link rel="alternate" href="https://infactsolutions.net/" hrefLang="x-default" />
      </head>
      <body className="font-body antialiased selection:bg-primary/70 selection:text-primary-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
