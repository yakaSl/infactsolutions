export interface ClientWork {
  id: number;
  imageUrl: string;
  dataAiHint: string;
  tags: string[];
}

export const clientWorks: ClientWork[] = [
    {
      id: 1,
      imageUrl: '/pastwork/ekwayamu.jpg',
      dataAiHint: 'non-profit website',
      tags: ['Web Development', 'UI/UX Design', 'Community Support'],
    },
    {
      id: 2,
      imageUrl: '/pastwork/rosmed.jpg',
      dataAiHint: 'wedding photography',
      tags: ['Photography', 'Branding', 'Portfolio'],
    },
    {
      id: 3,
      imageUrl: '/pastwork/taxi.jpg',
      dataAiHint: 'taxi app',
      tags: ['React Native', 'Firebase', 'Mobile App'],
    },
    {
      id: 4,
      imageUrl: '/pastwork/aws.jpg',
      dataAiHint: 'ecommerce platform',
      tags: ['Next.js', 'Node.js', 'GraphQL', 'MongoDB', 'React Native', 'AWS'],
    },
    {
      id: 5,
      imageUrl: '/pastwork/orbit.jpg',
      dataAiHint: 'mobile app',
      tags: ['Flutter', 'Firebase'],
    },
    {
      id: 6,
      imageUrl: '/pastwork/y.jpg',
      dataAiHint: 'website logo',
      tags: ['React'],
    },
    
];
