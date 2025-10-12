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
    default: 'INFACT SOLUTIONS | IT, Networking, & Cybersecurity in Sri Lanka',
    template: '%s | INFACT SOLUTIONS',
  },
  description: 'Leading provider of IT services, networking, cybersecurity, and custom software development in Colombo, Sri Lanka. Secure your business with our expert solutions.',
  openGraph: {
    title: 'INFACT SOLUTIONS | Premier IT & Cybersecurity in Sri Lanka',
    description: 'Expert IT solutions, networking, and cybersecurity services in Sri Lanka to secure and scale your business.',
    url: 'https://infactsolutions.net',
    siteName: 'INFACT SOLUTIONS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'INFACT SOLUTIONS - IT Services and Cybersecurity',
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
    title: 'INFACT SOLUTIONS | Premier IT & Cybersecurity in Sri Lanka',
    description: 'Secure and scale your business with INFACT SOLUTIONS, Colombo’s trusted IT, networking, and software development partner.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark scroll-smooth`}>
      <body className="font-body antialiased selection:bg-primary/70 selection:text-primary-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
