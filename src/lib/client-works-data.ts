export interface ClientWork {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
  tags: string[];
}

export const clientWorks: ClientWork[] = [
    {
      id: 1,
      title: 'Ekwayamu Official Website',
      category: 'Non-Profit Organization',
      description: 'Ekwayamu is a non-profit organization registered in Switzerland (NPO number CHE-422.823.093). Our team supports people on a voluntary basis, regardless of religious or ethnic boundaries.',
      imageUrl: '/pastwork/ekwayamu.jpg',
      dataAiHint: 'non-profit website',
      tags: ['Web Development', 'UI/UX Design', 'Community Support'],
    },
    {
      id: 2,
      title: 'Rosemed - Weddings',
      category: 'Wedding Photography',
      description: 'Captured timeless moments for Rosemed Weddings, providing a stunning digital portfolio to showcase their beautiful photography work.',
      imageUrl: '/pastwork/rosmed.jpg',
      dataAiHint: 'wedding photography',
      tags: ['Photography', 'Branding', 'Portfolio'],
    },
    {
      id: 3,
      title: 'Turn Taxi',
      category: 'Mobile Application',
      description: 'A platform for both taxi drivers and passengers to find hires and vehicles, built with modern mobile technology.',
      imageUrl: '/pastwork/taxi.jpg',
      dataAiHint: 'taxi app',
      tags: ['React Native', 'Firebase', 'Mobile App'],
    },
    {
      id: 4,
      title: 'Asian Wave',
      category: 'E-commerce Platform',
      description: 'A comprehensive multivendor e-commerce platform connecting buyers and sellers across Asia, powered by a modern and scalable tech stack.',
      imageUrl: '/pastwork/aws.jpg',
      dataAiHint: 'ecommerce platform',
      tags: ['Next.js', 'Node.js', 'GraphQL', 'MongoDB', 'React Native', 'AWS'],
    },
];
