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
      title: 'QuantumLeap CRM',
      category: 'Enterprise Software',
      description: 'A cutting-edge CRM platform built for a leading sales organization, improving lead management and boosting team productivity by 40%.',
      imageUrl: 'https://placehold.co/500x350.png',
      dataAiHint: 'CRM dashboard',
      tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    },
    {
      id: 2,
      title: 'AetherFlow Analytics',
      category: 'Data Analytics',
      description: 'Developed a real-time data analytics dashboard for a fintech startup, providing actionable insights into market trends and user behavior.',
      imageUrl: 'https://placehold.co/500x350.png',
      dataAiHint: 'analytics charts',
      tags: ['Vue.js', 'Python', 'BigQuery', 'GCP'],
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
