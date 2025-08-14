
export interface InvestmentSlot {
  status: 'available' | 'booked';
}

export interface Project {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  dataAiHint: string;
  description: string;
  expectedInvestment: number;
  currentInvestment: number;
  pitchDeckUrl: string;
  websiteUrl?: string;
  screenshots: string[];
  investmentSlots: InvestmentSlot[];
}

export const projects: Project[] = [
    {
      id: 1,
      title: 'LearnLabz - Tutor Saas',
      category: 'Web Application + Mobile Application',
      imageUrl: '/projects/learnlabz.jpg',
      dataAiHint: 'dashboard analytics',
      description: 'Learn Labz is a cloud-based platform that empowers tutors with modern tools to manage classes, track student progress, and deliver better outcomes — all in one place.',
      expectedInvestment: 5000000,
      currentInvestment: 0,
      pitchDeckUrl: '/projects/learnlabz/Proposal.pdf',
      websiteUrl: 'https://learnlabz.com',
      screenshots: [
        '/projects/learnlabz/dashboard.jpeg',
        '/projects/learnlabz/login.jpg',
        'https://placehold.co/1200x800.png',
      ],
      investmentSlots: Array(50).fill({ status: 'available' }),
    },
    {
      id: 2,
      title: 'Meraic - Property Management System',
      category: 'Web Application + Mobile Application',
      imageUrl: '/projects/meraic/logo.jpg',
      dataAiHint: 'property management',
      description: "Meraic is a cloud-native PropTech startup offering an all-in-one SaaS platform that unites property listings with complete management tools.",
      expectedInvestment: 5000000,
      currentInvestment: 0,
      pitchDeckUrl: '/projects/meraic/proposal.pdf',
      websiteUrl: 'https://meraic.com',
      screenshots: [
        '/projects/meraic/dashboard.jpg',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
      investmentSlots: Array(50).fill({ status: 'available' })
    },
    {
      id: 3,
      title: 'Momento - Event Management',
      category: 'Mobile App',
      imageUrl: '/projects/momento/logo.jpg',
      dataAiHint: 'mobile app',
      description: 'Momento is a tool which service providers can use to grow their businesses and users can use it to easily manage and plan their memorable events. No matter what is your event, if you want any support we are here to provide you the best possible service you could ever found at a shorter duration.',
      expectedInvestment: 10000000,
      currentInvestment: 3500000,
      pitchDeckUrl: '/projects/momento/proposal.pdf',
      websiteUrl: 'https://momento.lk',
      screenshots: [
        '/projects/momento/dashboard.jpg',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
      investmentSlots: [
        { status: 'booked' }, { status: 'booked' }, { status: 'booked' }, { status: 'booked' },
        { status: 'booked' }, { status: 'booked' }, { status: 'booked' }, { status: 'available' },
        { status: 'available' }, { status: 'available' }, { status: 'available' }, { status: 'available' },
        { status: 'available' }, { status: 'available' }, { status: 'available' }, { status: 'available' },
        { status: 'available' }, { status: 'available' }, { status: 'available' }, { status: 'available' }
      ]
    },
    {
      id: 4,
      title: 'Travel Wish - Tourism Help App',
      category: 'Mobile Application',
      imageUrl: '/projects/travelwish/logo.jpg',
      dataAiHint: 'tourism mobile app',
      description: 'Travel Wish is a versatile mobile application that serves both service providers in the tourism industry and travelers. It empowers tourists to independently explore their destinations by offering detailed information about local attractions, recommended accommodations, dining options, transportation services, and upcoming events.',
      expectedInvestment: 100000000,
      currentInvestment: 0,
      pitchDeckUrl: '/projects/travelwish/proposal.pdf',
      screenshots: [
        '/projects/travelwish/dashboard.jpg',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
      investmentSlots: Array(50).fill({ status: 'available' })
    },
     {
      id: 5,
      title: 'AI Customer Service Chatbot',
      category: 'Artificial Intelligence',
      imageUrl: 'https://placehold.co/500x350.png',
      dataAiHint: 'chatbot interface',
      description: 'Developed an AI-powered customer service chatbot that handles over 60% of customer inquiries, reducing wait times and improving satisfaction.',
      expectedInvestment: 250000,
      currentInvestment: 100000,
      pitchDeckUrl: '/pitch-deck-ai-chatbot.pdf',
      screenshots: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
      investmentSlots: [
        { status: 'booked' }, { status: 'booked' }, { status: 'available' }, { status: 'available' },
        { status: 'available' }, { status: 'available' }, { status: 'available' }, { status: 'available' }
      ]
    },
    {
      id: 6,
      title: 'SaaS Platform Redesign',
      category: 'UI/UX Design',
      imageUrl: 'https://placehold.co/500x350.png',
      dataAiHint: 'brand identity',
      description: 'A complete brand identity and website redesign for a SaaS company, leading to improved user experience and increased conversion rates.',
      expectedInvestment: 150000,
      currentInvestment: 150000,
      pitchDeckUrl: '/pitch-deck-saas-redesign.pdf',
      screenshots: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
      investmentSlots: [
        { status: 'booked' }, { status: 'booked' }, { status: 'booked' }, { status: 'booked' }
      ]
    }
];
