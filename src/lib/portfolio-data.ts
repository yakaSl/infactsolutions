// Client-work portfolio (separate from the investment `Project` model in
// projects-data.ts). This drives the /portfolio page whose goal is winning new
// client work. `imageUrl` slugs match the screenshots in public/portfolio/
// produced by scripts/capture-screenshots.mjs; items without a public website
// (mobile-only apps) omit imageUrl and render a branded fallback in the card.

export const INDUSTRIES = [
  'Tourism & Travel',
  'Marketplaces & Commerce',
  'Mobility & Delivery',
  'Healthcare',
  'Creative Media & Events',
  'SaaS & Education',
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export interface PortfolioItem {
  slug: string;
  title: string;
  industry: Industry;
  projectType: string;
  summary: string;
  highlights: string[];
  liveUrl?: string;
  imageUrl?: string;
}

export const portfolioItems: PortfolioItem[] = [
  // --- Tourism & Travel ---
  {
    slug: 'srimal-safari',
    title: 'Srimal Safari',
    industry: 'Tourism & Travel',
    projectType: 'Safari & travel experience website',
    summary:
      'A wildlife tourism website built around Sri Lankan safari experiences, nature storytelling, and booking-oriented visitor journeys.',
    highlights: [
      'Safari experience presentation',
      'Wildlife & nature storytelling',
      'Tourism-focused conversion flow',
      'Trust-building for local & international visitors',
    ],
    liveUrl: 'https://srimalsafari.com',
    imageUrl: '/portfolio/srimal-safari.jpg',
  },
  {
    slug: 'linaya-ceylon-tours',
    title: 'Linaya Ceylon Tours',
    industry: 'Tourism & Travel',
    projectType: 'Premium travel & tour website',
    summary:
      'A premium tourism website designed for private tours, transport, curated destinations, and high-value travel inquiries.',
    highlights: [
      'Private tour & transport presentation',
      'Destination-focused user journey',
      'Premium visual direction',
      'Inquiry & booking-focused structure',
    ],
    liveUrl: 'https://linayaceylontours.com',
    imageUrl: '/portfolio/linaya-ceylon-tours.jpg',
  },
  {
    slug: 'gaanu-place',
    title: 'Gaanu Place',
    industry: 'Tourism & Travel',
    projectType: 'Accommodation & hospitality website',
    summary:
      'A hospitality-focused web presence designed for warm brand presentation, guest inquiries, and destination-style storytelling.',
    highlights: [
      'Hospitality brand presentation',
      'Guest inquiry direction',
      'Destination-focused storytelling',
      'Clean, simple user journey',
    ],
    liveUrl: 'https://gaanuplace.vercel.app',
    imageUrl: '/portfolio/gaanu-place.jpg',
  },

  // --- Marketplaces & Commerce ---
  {
    slug: 'megadeal',
    title: 'MegaDeal',
    industry: 'Marketplaces & Commerce',
    projectType: 'Gem marketplace platform',
    summary:
      'A marketplace-style platform focused on gem listings, product discovery, dealer presentation, and trust-led trading.',
    highlights: [
      'Gem marketplace structure',
      'Product discovery & categories',
      'Dealer & seller presentation',
      'Marketplace-ready business model',
    ],
    liveUrl: 'https://www.megadeal.lk',
    imageUrl: '/portfolio/megadeal.jpg',
  },
  {
    slug: 'chilanka-gems',
    title: 'Chilanka Gems',
    industry: 'Marketplaces & Commerce',
    projectType: 'Gem & jewellery brand website',
    summary:
      'A gem and jewellery brand website focused on product presentation, visual trust, customer inquiries, and premium retail positioning.',
    highlights: [
      'Jewellery & gem product presentation',
      'Premium visual direction',
      'Customer inquiry support',
      'Retail & export-friendly positioning',
    ],
    liveUrl: 'https://chilanka-gems.vercel.app',
    imageUrl: '/portfolio/chilanka-gems.jpg',
  },
  {
    slug: 'mangohub',
    title: 'MANGOHUB',
    industry: 'Marketplaces & Commerce',
    projectType: 'Multivendor shopping platform',
    summary:
      'A multivendor shopping platform supporting multiple sellers, product listings, customer shopping flows, checkout, and admin control.',
    highlights: [
      'Multivendor marketplace structure',
      'Vendor product listings',
      'Cart & checkout direction',
      'Order management & admin control',
    ],
  },
  {
    slug: 'asianwave',
    title: 'ASIANWAVE',
    industry: 'Marketplaces & Commerce',
    projectType: 'Multivendor marketplace platform',
    summary:
      'A scalable marketplace foundation for vendor onboarding, product management, customer shopping flows, and platform operations.',
    highlights: [
      'Vendor onboarding direction',
      'Product management',
      'Marketplace navigation & order workflow',
      'Mobile-first marketplace experience',
    ],
  },

  // --- Mobility & Delivery ---
  {
    slug: 'turn-taxi',
    title: 'Turn Taxi',
    industry: 'Mobility & Delivery',
    projectType: 'Taxi booking & ride-hailing platform',
    summary:
      'A ride-hailing platform built around passenger booking flows, ride management, fare presentation, and location-based service architecture.',
    highlights: [
      'Passenger ride booking flow',
      'Driver-side workflow support',
      'Fare presentation structure',
      'Location-based service architecture',
    ],
    liveUrl: 'https://turntaxi.com',
    imageUrl: '/portfolio/turn-taxi.jpg',
  },
  {
    slug: 'bringit',
    title: 'BringIT',
    industry: 'Mobility & Delivery',
    projectType: 'Delivery & personal shopping ecosystem',
    summary:
      'A delivery and personal shopping platform spanning a customer app, agent app, admin dashboard, and Firebase backend.',
    highlights: [
      'Customer ordering & agent handling',
      'Invoice & receipt uploads',
      'Real-time delivery status updates',
      'Role-based access & admin control panel',
    ],
  },

  // --- Healthcare ---
  {
    slug: 'thuru-lanka',
    title: 'Thuru Lanka Hospitals',
    industry: 'Healthcare',
    projectType: 'Hospital & medical service website',
    summary:
      'A healthcare website designed around appointment direction, service discovery, doctor presentation, and patient-friendly communication.',
    highlights: [
      'Appointment-focused user journey',
      'Medical service presentation',
      'Doctor & training information',
      'Calm, trustworthy healthcare design',
    ],
    liveUrl: 'https://thurulankaweb.vercel.app',
    imageUrl: '/portfolio/thuru-lanka.jpg',
  },

  // --- Creative Media & Events ---
  {
    slug: 'barnes-media',
    title: 'Barnes Media',
    industry: 'Creative Media & Events',
    projectType: 'Photography & videography portfolio',
    summary:
      'A creative media portfolio built around gallery-first storytelling, premium visual presentation, and brand trust.',
    highlights: [
      'Gallery-first visual experience',
      'Cinematic portfolio direction',
      'Creative brand positioning',
      'Lead-generation contact flow',
    ],
    liveUrl: 'https://www.barnesmedia.lk',
    imageUrl: '/portfolio/barnes-media.jpg',
  },
  {
    slug: 'rosmed-weddings',
    title: 'Rosmed Weddings',
    industry: 'Creative Media & Events',
    projectType: 'Wedding portfolio & inquiry website',
    summary:
      'A wedding photography portfolio designed with emotional storytelling, gallery-first presentation, and inquiry generation.',
    highlights: [
      'Wedding photography portfolio',
      'Emotional visual storytelling',
      'Package presentation',
      'Inquiry & contact flow',
    ],
    liveUrl: 'https://rosmed-weddings.vercel.app',
    imageUrl: '/portfolio/rosmed-weddings.jpg',
  },
  {
    slug: 'djy-music',
    title: 'DJY Music',
    industry: 'Creative Media & Events',
    projectType: 'DJ & event service website',
    summary:
      'An event entertainment website for DJ services, sound systems, event packages, gallery, reviews, and AI-assisted recommendations.',
    highlights: [
      'DJ & entertainment service presentation',
      'Sound, lighting & package sections',
      'Gallery & testimonial direction',
      'AI-assisted package recommendation',
    ],
    liveUrl: 'https://www.djymusic.com',
    imageUrl: '/portfolio/djy-music.jpg',
  },
  {
    slug: 'momento',
    title: 'Momento',
    industry: 'Creative Media & Events',
    projectType: 'Event planning ecosystem',
    summary:
      'An event planning ecosystem supporting organizers, vendors, timelines, budgets, document storage, and day-of-event operations.',
    highlights: [
      'Organizer & vendor workflows',
      'Event timeline & budget planning',
      'Document vault direction',
      'Day-of-event operations',
    ],
  },

  // --- SaaS & Education ---
  {
    slug: 'meraic',
    title: 'Meraic',
    industry: 'SaaS & Education',
    projectType: 'Property management SaaS',
    summary:
      'A PropTech SaaS web presence focused on listings, tenants, rent workflow, maintenance requests, pricing, and early-access lead capture.',
    highlights: [
      'SaaS product positioning',
      'Property management workflow',
      'Pricing & early-access conversion',
      'Scalable web app direction',
    ],
    liveUrl: 'https://www.meraic.com',
    imageUrl: '/portfolio/meraic.jpg',
  },
  {
    slug: 'orbit-english',
    title: 'Orbit English',
    industry: 'SaaS & Education',
    projectType: 'English learning mobile app',
    summary:
      'An educational app supporting English learning through a student-focused, mobile-first experience on a scalable EdTech foundation.',
    highlights: [
      'Student learning flow',
      'Course & lesson structure',
      'Progress direction',
      'Scalable EdTech foundation',
    ],
  },
  {
    slug: 'learnlabz',
    title: 'LearnLabz',
    industry: 'SaaS & Education',
    projectType: 'Learning platform',
    summary:
      "A learning platform representing Infact Solutions' experience in education technology and learning platform development.",
    highlights: [
      'Learning platform structure',
      'Student-focused interface',
      'Course & content organization',
      'Education-focused user experience',
    ],
  },
];
