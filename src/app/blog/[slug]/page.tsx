import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { blogPosts, getBlogPost } from '@/lib/blog-data';

const SITE_URL = 'https://infactsolutions.net';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) {
    return { title: 'Article not found' };
  }
  const canonical = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: { canonical },
    openGraph: {
      title: `${post.title} | INFACT SOLUTIONS`,
      description: post.description,
      url: canonical,
      type: 'article',
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | INFACT SOLUTIONS`,
      description: post.description,
      images: ['/og-image.png'],
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) {
    notFound();
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.description,
        keywords: post.keywords.join(', '),
        articleSection: post.category,
        datePublished: post.datePublished,
        dateModified: post.dateModified,
        author: { '@type': 'Organization', name: post.author, url: SITE_URL },
        publisher: { '@id': `${SITE_URL}/#organization` },
        image: `${SITE_URL}/og-image.png`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        inLanguage: 'en',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 md:px-6 py-12 md:py-20">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <div className="mx-auto max-w-3xl">
            <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3 text-muted-foreground">
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to all articles
              </Link>
            </Button>

            <Badge variant="secondary" className="mb-3">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-10 pb-8 border-b border-border/50">
              <span>{post.author}</span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTimeMinutes} min read
              </span>
            </div>

            <div className="space-y-6">
              {post.content.map((section, i) => (
                <section key={i} className="space-y-4">
                  {section.heading && (
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-primary pt-4">
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraphs?.map((para, j) => (
                    <p key={j} className="text-base md:text-lg leading-relaxed text-foreground/90">
                      {para}
                    </p>
                  ))}
                  {section.list && (
                    section.list.ordered ? (
                      <ol className="list-decimal space-y-2 pl-6 text-base md:text-lg text-foreground/90 marker:text-primary marker:font-semibold">
                        {section.list.items.map((item, k) => (
                          <li key={k} className="pl-1 leading-relaxed">{item}</li>
                        ))}
                      </ol>
                    ) : (
                      <ul className="list-disc space-y-2 pl-6 text-base md:text-lg text-foreground/90 marker:text-primary">
                        {section.list.items.map((item, k) => (
                          <li key={k} className="pl-1 leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    )
                  )}
                </section>
              ))}
            </div>

            {/* Call to action */}
            <div className="mt-14 rounded-xl border border-border/50 bg-card p-8 text-center shadow-lg">
              <h2 className="text-2xl font-semibold mb-2">Have a project in mind?</h2>
              <p className="text-muted-foreground mb-6">
                INFACT Solutions builds secure, scalable software and helps businesses strengthen
                their security. Let&apos;s talk about your goals.
              </p>
              <Button asChild size="lg">
                <Link href="/#contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
