import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import FirebaseAnalytics from "@/components/firebase-analytics"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://infactsolutions.net'),
  title: {
    default: 'INFACT SOLUTIONS: IT, Cybersecurity & Software Partner',
    template: '%s | INFACT SOLUTIONS',
  },
  description: 'Global IT partner for secure networking, cybersecurity, and custom web & mobile app development. Scalable, secure digital solutions for businesses worldwide.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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
    languages: {
      'en': 'https://infactsolutions.net/',
      'x-default': 'https://infactsolutions.net/',
    }
  }
};

// Organization + WebSite structured data (schema.org / JSON-LD). Rendered on
// every page to power brand knowledge-panel and rich results. `sameAs` lists the
// official social profiles so Google can connect them to the organization entity.
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://infactsolutions.net/#organization',
      name: 'INFACT SOLUTIONS',
      url: 'https://infactsolutions.net/',
      logo: 'https://infactsolutions.net/logo.png',
      description:
        'Global IT outsourcing partner delivering secure networking, cybersecurity, and custom web & mobile app development.',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@infactsolutions.net',
        contactType: 'customer support',
      },
      sameAs: [
        'https://lk.linkedin.com/company/infact-solutions-pvt-ltd',
        'https://www.facebook.com/infactsolutions/',
        'https://www.instagram.com/infactsolutions/',
        'https://www.tiktok.com/@infact.solutions',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://infactsolutions.net/#website',
      url: 'https://infactsolutions.net/',
      name: 'INFACT SOLUTIONS',
      publisher: { '@id': 'https://infactsolutions.net/#organization' },
      inLanguage: 'en',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark scroll-smooth`}>
      <head>
        {/* hreflang links are emitted by metadata.alternates.languages — do not
            duplicate them here, or audits flag "language specified more than once". */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-body antialiased selection:bg-primary/70 selection:text-primary-foreground">
        {children}
        <Toaster />
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
