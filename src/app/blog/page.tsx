import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Clock } from 'lucide-react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSortedBlogPosts } from '@/lib/blog-data';

const SITE_URL = 'https://infactsolutions.net';

export const metadata: Metadata = {
  title: 'Blog — Software, Cybersecurity & IT Insights',
  description:
    'Practical guides on custom software development, cybersecurity, and IT outsourcing from the INFACT Solutions team. Actionable advice for growing businesses.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Software, Cybersecurity & IT Insights | INFACT SOLUTIONS',
    description:
      'Practical guides on custom software development, cybersecurity, and IT outsourcing from the INFACT Solutions team.',
    url: '/blog',
    type: 'website',
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPage() {
  const posts = getSortedBlogPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    name: 'INFACT Solutions Blog',
    url: `${SITE_URL}/blog`,
    description:
      'Practical guides on custom software development, cybersecurity, and IT outsourcing.',
    publisher: { '@id': `${SITE_URL}/#organization` },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      author: { '@type': 'Organization', name: post.author },
    })),
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Insights &amp; Guides</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Practical advice on software development, cybersecurity, and IT outsourcing — written
              to help you make better technology decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
                <Card className="h-full flex flex-col group cursor-pointer shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-primary">
                  <CardHeader>
                    <Badge variant="secondary" className="self-start mb-2">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <p className="text-muted-foreground flex-grow">{post.excerpt}</p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(post.datePublished)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {post.readingTimeMinutes} min read
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
