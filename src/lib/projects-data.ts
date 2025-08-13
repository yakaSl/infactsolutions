
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
  screenshots: string[];
  investmentSlots: InvestmentSlot[];
}

export const projects: Project[] = [
    {
      id: 1,
      title: 'LearnLabz - Tutor Saas',
      category: 'Web Application',
      imageUrl: '/projects/learnlabz.jpg',
      dataAiHint: 'dashboard analytics',
      description: 'A comprehensive enterprise resource planning (ERP) system for logistics. Streamlines operations from inventory to delivery, boosting efficiency by 30%.',
      expectedInvestment: 5000000,
      currentInvestment: 0,
      pitchDeckUrl: '/pitch-deck-alpha.pdf',
      screenshots: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
      investmentSlots: [
        { status: 'available' }, { status: 'available' }, { status: 'available' }, { status: 'available' },
        { status: 'available' }, { status: 'available' }, { status: 'available' }, { status: 'available' },
        { status: 'available' }, { status: 'available' }
      ]
    },
    {
      id: 2,
      title: 'AR Fashion E-commerce App',
      category: 'Mobile App',
      imageUrl: 'https://placehold.co/500x350.png',
      dataAiHint: 'shopping app',
      description: 'Sleek mobile e-commerce app for a fashion startup with AR try-on. Boosted user engagement and sales by 50% in six months.',
      expectedInvestment: 750000,
      currentInvestment: 400000,
      pitchDeckUrl: '/pitch-deck-ecommerce.pdf',
      screenshots: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
      investmentSlots: [
        { status: 'booked' }, { status: 'booked' }, { status: 'booked' }, { status: 'booked' },
        { status: 'booked' }, { status: 'available' }, { status: 'available' }, { status: 'available' },
        { status: 'available' }, { status: 'available' }, { status: 'available' }, { status: 'available' }
      ]
    },
    {
      id: 3,
      title: 'Fintech DataVis Dashboard',
      category: 'Data Analytics',
      imageUrl: 'https://placehold.co/500x350.png',
      dataAiHint: 'data visualization',
      description: 'Interactive data visualization dashboard for a financial services firm, enabling real-time monitoring of market trends and portfolio performance.',
      expectedInvestment: 300000,
      currentInvestment: 300000,
      pitchDeckUrl: '/pitch-deck-dataviz.pdf',
      screenshots: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
      investmentSlots: [
        { status: 'booked' }, { status: 'booked' }, { status: 'booked' }, { status: 'booked' },
        { status: 'booked' }, { status: 'booked' }
      ]
    },
    {
      id: 4,
      title: 'Project Beta - Cloud Migration',
      category: 'Cloud & DevOps',
      imageUrl: 'https://placehold.co/500x350.png',
      dataAiHint: 'cloud infrastructure',
      description: 'Complete cloud migration for a healthcare provider to a secure, scalable, and HIPAA-compliant AWS infrastructure, reducing operational costs.',
      expectedInvestment: 400000,
      currentInvestment: 150000,
      pitchDeckUrl: '/pitch-deck-beta.pdf',
      screenshots: [
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
        'https://placehold.co/1200x800.png',
      ],
      investmentSlots: [
        { status: 'booked' }, { status: 'booked' }, { status: 'booked' }, { status: 'available' },
        { status: 'available' }, { status: 'available' }, { status: 'available' }, { status: 'available' }
      ]
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
