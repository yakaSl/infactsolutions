import { MetadataRoute } from 'next';
import { projects } from '@/lib/projects-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://infactsolutions.net';
  // Stable build timestamp so lastModified doesn't churn on every request.
  const lastModified = new Date();

  const projectPages = projects.map(project => ({
    url: `${siteUrl}/projects/${project.id}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticPages = [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/portfolio`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  return [...staticPages, ...projectPages];
}
