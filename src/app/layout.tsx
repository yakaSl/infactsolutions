import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'INFACT SOLUTIONS',
  description: 'Driving innovation and energy through technology.',
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
