export interface ClientWork {
  id: number;
  title: string;
  imageUrl: string;
  dataAiHint: string;
  tags: string[];
}

export const clientWorks: ClientWork[] = [
    {
      id: 1,
      title: 'Ekwayamu Official Website',
      imageUrl: '/pastwork/ekwayamu.jpg',
      dataAiHint: 'non-profit website',
      tags: ['Web Development', 'UI/UX Design', 'Community Support'],
    },
    {
      id: 2,
      title: 'Rosemed - Weddings',
      imageUrl: '/pastwork/rosmed.jpg',
      dataAiHint: 'wedding photography',
      tags: ['Photography', 'Branding', 'Portfolio'],
    },
    {
      id: 3,
      title: 'Turn Taxi',
      imageUrl: '/pastwork/taxi.jpg',
      dataAiHint: 'taxi app',
      tags: ['React Native', 'Firebase', 'Mobile App'],
    },
    {
      id: 4,
      title: 'Asian Wave',
      imageUrl: '/pastwork/aws.jpg',
      dataAiHint: 'ecommerce platform',
      tags: ['Next.js', 'Node.js', 'GraphQL', 'MongoDB', 'React Native', 'AWS'],
    },
];
