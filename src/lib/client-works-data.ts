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
      title: 'Nova Mobile Banking',
      category: 'Mobile App',
      description: 'A secure and intuitive mobile banking application for a regional bank, featuring biometric login and P2P payments.',
      imageUrl: 'https://placehold.co/500x350.png',
      dataAiHint: 'mobile banking',
      tags: ['React Native', 'Firebase', 'iOS', 'Android'],
    },
    {
      id: 4,
      title: 'ConnectSphere Social',
      category: 'Web Application',
      description: 'A vibrant social networking platform designed to connect professionals within niche industries, fostering collaboration and knowledge sharing.',
      imageUrl: 'https://placehold.co/500x350.png',
      dataAiHint: 'social network',
      tags: ['Next.js', 'GraphQL', 'MongoDB', 'Vercel'],
    },
];
