/**
 * PowerPoint Export: Pitch Deck
 * Converts pitch-deck-content.md to .pptx file
 * Uses pptxgenjs library
 * Bloomberg × McKinsey design aesthetics
 */

import PptxGenJS from 'pptxgenjs';

export interface SlideContent {
  title?: string;
  subtitle?: string;
  tagline?: string;
  points?: string[];
  tableData?: { head: string[]; body: string[][] };
  chartData?: any;
  footer?: string;
}

export function generatePitchDeck(): Buffer {
  const pptx = new PptxGenJS();
  
  // Set presentation properties
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'AM Creator Analytics';
  pptx.title = 'AM Creator Analytics - Pitch Deck';
  pptx.subject = 'Creator Economy Analytics Platform';
  
  // Colors (Bloomberg × McKinsey)
  const colors = {
    background: 'F8F7F4',
    primary: '1a1a2e',
    accent: '92400e',
    success: '16a34a',
    error: 'dc2626',
    gray: '6b7280',
    white: 'FFFFFF',
  };
  
  // Helper: Add slide with standard background
  const addSlide = () => {
    const slide = pptx.addSlide();
    slide.background = { color: colors.background };
    return slide;
  };
  
  // Helper: Add title text
  const addTitle = (slide: any, text: string, y: number = 0.5) => {
    slide.addText(text, {
      x: 0.5,
      y,
      w: 9,
      h: 0.8,
      fontSize: 24,
      bold: true,
      color: colors.primary,
      fontFace: 'Inter',
    });
  };
  
  // Helper: Add body text
  const addBody = (slide: any, text: string, x: number = 1, y: number = 1.5, options: any = {}) => {
    slide.addText(text, {
      x,
      y,
      w: 8,
      h: 4,
      fontSize: 14,
      color: colors.primary,
      fontFace: 'Inter',
      ...options,
    });
  };
  
  // Helper: Add bulleted list
  const addBulletList = (slide: any, items: string[], x: number = 1, y: number = 1.5) => {
    const text = items.map(item => `• ${item}`).join('\n');
    slide.addText(text, {
      x,
      y,
      w: 8,
      h: 4,
      fontSize: 14,
      color: colors.primary,
      fontFace: 'Inter',
      lineSpacing: 20,
    });
  };
  
  // Helper: Add table
  const addTable = (slide: any, head: string[], body: string[][], y: number = 2) => {
    slide.addTable([head, ...body], {
      x: 1,
      y,
      w: 8,
      color: colors.primary,
      border: { pt: 1, color: 'e5e7eb' },
      fill: { color: colors.white },
      fontSize: 12,
      fontFace: 'Inter',
    });
  };

  // ========== Slide 1: Cover ==========
  const slide1 = addSlide();
  slide1.addText('AM Creator Analytics', {
    x: 1,
    y: 2.5,
    w: 8,
    h: 1,
    fontSize: 32,
    bold: true,
    color: colors.primary,
    align: 'center',
    fontFace: 'Inter',
  });
  slide1.addText('The Operating System for Creator Economy', {
    x: 1,
    y: 3.5,
    w: 8,
    h: 0.5,
    fontSize: 16,
    color: colors.accent,
    align: 'center',
    fontFace: 'Inter',
  });
  slide1.addText('Save ₹80K-2L/month with open-source stack', {
    x: 1,
    y: 4.2,
    w: 8,
    h: 0.5,
    fontSize: 14,
    color: colors.gray,
    align: 'center',
    fontFace: 'Inter',
  });

  // ========== Slide 2: Problem ==========
  const slide2 = addSlide();
  addTitle(slide2, 'Problem: Creator Economy is Fragmented');
  addBulletList(slide2, [
    'Brands use 5+ tools to manage creators (₹3L/month)',
    'Creators wait 45 days for payouts',
    'Compliance (DPDPA) is manual nightmare',
    'No single view of ROI across campaigns',
  ]);
  slide2.addText('Market Reality:\n• 500M+ creators in India\n• $104B global creator economy\n• Brands waste 30% time on tool-switching', {
    x: 1,
    y: 4.5,
    w: 8,
    h: 1.5,
    fontSize: 12,
    color: colors.gray,
    fontFace: 'Inter',
  });

  // ========== Slide 3: Solution ==========
  const slide3 = addSlide();
  addTitle(slide3, 'Solution: All-in-One Creator Analytics Platform');
  slide3.addText('AM Creator Analytics provides:', {
    x: 1,
    y: 1.3,
    w: 8,
    h: 0.5,
    fontSize: 16,
    bold: true,
    color: colors.primary,
    fontFace: 'Inter',
  });
  addBulletList(slide3, [
    '✅ Creator Management - Onboard, track, pay (save 60% time)',
    '✅ Campaign Tracking - ROI, engagement, real-time',
    '✅ Automated Contracts - OpenSign integration (save ₹20K/month)',
    '✅ Instant Payouts - Stripe Connect (save 30 days)',
    '✅ DPDPA Compliance - Built-in (save ₹50K in fines)',
  ]);
  slide3.addText('Open-Source Advantage:\nSave ₹80K-2L/month vs competitors (Merge.dev, DocuSign, Cloudinary)', {
    x: 1,
    y: 5,
    w: 8,
    h: 1,
    fontSize: 12,
    color: colors.accent,
    bold: true,
    fontFace: 'Inter',
  });

  // ========== Slide 4: Market Opportunity ==========
  const slide4 = addSlide();
  addTitle(slide4, 'Market Opportunity: $104B+ Creator Economy');
  addBulletList(slide4, [
    'TAM: $104B (Global creator economy)',
    'SAM: $12B (India + Southeast Asia)',
    'SOM: $120M (Initial target: India English+Hindi speakers)',
  ]);
  slide4.addText('Growth Drivers:\n• 500M+ creators in India (528M Hindi speakers!)\n• Brands shifting 40% budget to creators\n• Government push (Digital India, DPDPA compliance)', {
    x: 1,
    y: 4.5,
    w: 8,
    h: 1.5,
    fontSize: 12,
    color: colors.gray,
    fontFace: 'Inter',
  });
  // Market size highlight
  slide4.addText('$104B', {
    x: 3.5,
    y: 2.5,
    w: 3,
    h: 0.8,
    fontSize: 48,
    bold: true,
    color: colors.accent,
    align: 'center',
    fontFace: 'Inter',
  });

  // ========== Slide 5: Product Demo ==========
  const slide5 = addSlide();
  addTitle(slide5, 'Product Demo: Bloomberg × McKinsey Design');
  addBulletList(slide5, [
    'Agency Command Center - Revenue, margins, creator growth',
    'Brand Dashboard - Campaign ROI, creator discovery',
    'Creator Portal - Earnings, media kit, payouts',
    'Mobile App - Check earnings on-the-go (React Native)',
  ]);
  slide5.addText('Tech Stack (Open-Source = ₹80K-2L/month savings):\n• Frontend: Next.js 15 (Webpack)\n• Backend: Prisma + PostgreSQL\n• Contracts: OpenSign (self-hosted)\n• Search: MeiliSearch (self-hosted)\n• Storage: MinIO (self-hosted)', {
    x: 1,
    y: 5,
    w: 8,
    h: 1.5,
    fontSize: 11,
    color: colors.gray,
    fontFace: 'Inter',
  });

  // ========== Slide 6: Business Model ==========
  const slide6 = addSlide();
  addTitle(slide6, 'Business Model: Simple, Transparent Pricing');
  addTable(slide6, 
    ['Plan', 'Price', 'Features', 'Target'],
    [
      ['Starter', '₹0/month', '5 creators, 2 campaigns', 'Individual creators'],
      ['Professional', '₹299/month', '50 creators, 20 campaigns, Media Kit', 'Small brands'],
      ['Elite', '₹999/month', 'Unlimited, Predictive ROI, Phone support', 'Agencies'],
    ],
    2
  );
  slide6.addText('Revenue Streams:\n• Subscriptions (70%) - ₹299-999/month\n• Transaction Fee (20%) - 2% on payouts via Stripe\n• Enterprise (10%) - Custom integrations, white-label', {
    x: 1,
    y: 5.5,
    w: 8,
    h: 1,
    fontSize: 12,
    color: colors.gray,
    fontFace: 'Inter',
  });

  // ========== Slide 7: Traction ==========
  const slide7 = addSlide();
  addTitle(slide7, 'Strong Early Traction');
  addTable(slide7,
    ['Metric', 'Value'],
    [
      ['Creators Onboarded', '500+'],
      ['Brands Using', '50+'],
      ['Campaigns Managed', '200+'],
      ['Total Spend Tracked', '₹10L+'],
      ['Customer Rating', '4.8/5 stars'],
    ],
    2
  );
  slide7.addText('Growth Rate:\n• Month-over-Month: +35% new creators\n• Creator Retention: 92%\n• Brand Retention: 88%', {
    x: 5,
    y: 2,
    w: 4,
    h: 2,
    fontSize: 12,
    color: colors.gray,
    fontFace: 'Inter',
  });

  // ========== Slide 8: Competitive Advantage ==========
  const slide8 = addSlide();
  addTitle(slide8, 'Competitive Advantage: Why Choose AM Creator Analytics?');
  addTable(slide8,
    ['Feature', 'AM Creator', 'Competitor A', 'Competitor B'],
    [
      ['Open-Source Stack', '✅ Save ₹80K-2L/mo', '❌', '❌'],
      ['Bloomberg × McKinsey Design', '✅ Premium feel', '❌ Basic', '❌ Basic'],
      ['Mobile App', '✅ React Native', '❌', '✅'],
      ['Multi-Language (i18n)', '✅ 5 languages', '❌ English only', '❌ English only'],
      ['Self-Hosted Options', '✅ Full control', '❌ SaaS only', '❌ SaaS only'],
      ['DPDPA Compliance', '✅ Built-in', '❌ Extra $5K', '❌ Extra $3K'],
    ],
    2
  );

  // ========== Slide 9: Technology Stack ==========
  const slide9 = addSlide();
  addTitle(slide9, 'Technology Stack: Modern, Scalable, Open-Source');
  slide9.addText('Frontend:\n• Next.js 15 (App Router)\n• React 18 + TypeScript\n• Recharts (analytics)\n• Tailwind CSS (styling)', {
    x: 1,
    y: 1.5,
    w: 4,
    h: 2,
    fontSize: 12,
    color: colors.primary,
    fontFace: 'Inter',
  });
  slide9.addText('Backend:\n• Next.js API Routes (15+ endpoints)\n• Prisma ORM + PostgreSQL\n• NextAuth.js (authentication)\n• Redis (caching, self-hosted)', {
    x: 5,
    y: 1.5,
    w: 4,
    h: 2,
    fontSize: 12,
    color: colors.primary,
    fontFace: 'Inter',
  });
  slide9.addText('Integrations:\n• OpenSign (contracts, self-hosted)\n• Stripe Connect (payouts)\n• Nango (CRM sync, self-hosted)\n• MinIO (storage, self-hosted)\n• MeiliSearch (search, self-hosted)', {
    x: 1,
    y: 4,
    w: 8,
    h: 2,
    fontSize: 12,
    color: colors.gray,
    fontFace: 'Inter',
  });
  slide9.addText('Cost Advantage: Self-hosted = ₹80K-2L/month savings vs SaaS!', {
    x: 1,
    y: 6.2,
    w: 8,
    h: 0.5,
    fontSize: 14,
    bold: true,
    color: colors.accent,
    align: 'center',
    fontFace: 'Inter',
  });

  // ========== Slide 10: Team ==========
  const slide10 = addSlide();
  addTitle(slide10, 'Team: Lean, Technical, Driven');
  slide10.addText('Founder: [Your Name]\n• Background: [Your background - e.g., Equity Research, Semiconductor Analyst]\n• Expertise: [Your expertise]\n• Role: Product + Tech + Sales', {
    x: 1,
    y: 1.5,
    w: 8,
    h: 1.5,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Inter',
  });
  slide10.addText('Advisors:\n• [Advisor 1] - [Their expertise]\n• [Advisor 2] - [Their expertise]', {
    x: 1,
    y: 3.5,
    w: 8,
    h: 1,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Inter',
  });
  slide10.addText('Hiring Plan (post-funding):\n1. CTO - Scale infrastructure\n2. Head of Sales - Close brand deals\n3. Customer Success - Onboard agencies', {
    x: 1,
    y: 5,
    w: 8,
    h: 1.2,
    fontSize: 12,
    color: colors.gray,
    fontFace: 'Inter',
  });

  // ========== Slide 11: Financial Projections ==========
  const slide11 = addSlide();
  addTitle(slide11, 'Financial Projections: Path to ₹10L/month ARR');
  addTable(slide11,
    ['Year', 'Customers', 'ARR', 'Expenses', 'Net'],
    [
      ['Year 1', '160', '₹36L', '₹60L', '-₹24L'],
      ['Year 2', '500', '₹1.2Cr', '₹80L', '+₹40L'],
      ['Year 3', '1500', '₹3.6Cr', '₹1.5Cr', '+₹2.1Cr'],
    ],
    2
  );
  slide11.addText('Key Metrics (Year 1):\n• MRR Growth: +35% MoM\n• CAC Payback: 6 months\n• LTV/CAC: 4.2x\n• Gross Margin: 85%', {
    x: 1,
    y: 5.5,
    w: 8,
    h: 1,
    fontSize: 12,
    color: colors.gray,
    fontFace: 'Inter',
  });

  // ========== Slide 12: The Ask ==========
  const slide12 = addSlide();
  addTitle(slide12, 'The Ask: $500K Seed Round');
  slide12.addText('Use of Funds (18-month runway):', {
    x: 1,
    y: 1.3,
    w: 8,
    h: 0.5,
    fontSize: 16,
    bold: true,
    color: colors.primary,
    fontFace: 'Inter',
  });
  addBulletList(slide12, [
    '40% Product ($200K) - Mobile app, AI features, GraphQL',
    '30% Marketing ($150K) - Content, ads, sales team',
    '30% Operations ($150K) - Hires, infrastructure, legal',
  ]);
  slide12.addText('Milestones (18 months):\n✅ 500+ creators onboarded\n✅ ₹10L MRR ($12K/month)\n✅ Mobile app live (10K downloads)\n✅ Series A ready ($2M+ raise)', {
    x: 1,
    y: 5,
    w: 8,
    h: 1.2,
    fontSize: 12,
    color: colors.gray,
    fontFace: 'Inter',
  });
  slide12.addText('Investment Terms:\n• Raising: $500K\n• Valuation: $4M pre-money\n• Equity: 12.5%\n• Type: Convertible note / SAFE', {
    x: 1,
    y: 6.5,
    w: 8,
    h: 0.8,
    fontSize: 11,
    color: colors.accent,
    fontFace: 'Inter',
  });

  // ========== Slide 13: Contact ==========
  const slide13 = addSlide();
  addTitle(slide13, 'Contact: Let\'s Build the Future of Creator Economy');
  slide13.addText('Get in Touch:', {
    x: 1,
    y: 1.5,
    w: 8,
    h: 0.5,
    fontSize: 16,
    bold: true,
    color: colors.primary,
    fontFace: 'Inter',
  });
  slide13.addText('Email: [your-email@example.com]\nPhone: [your-phone]\nDemo: https://am-creator-analytics.vercel.app\nGitHub: https://github.com/[your-username]/am-creator-analytics', {
    x: 1,
    y: 2.5,
    w: 8,
    h: 1.2,
    fontSize: 14,
    color: colors.primary,
    fontFace: 'Inter',
  });
  slide13.addText('Call to Action:\n"Join us in empowering 500M+ creators with transparent, affordable analytics."', {
    x: 1,
    y: 4.5,
    w: 8,
    h: 0.8,
    fontSize: 14,
    bold: true,
    color: colors.accent,
    align: 'center',
    fontFace: 'Inter',
  });
  slide13.addText('[Insert QR code image here - link to demo]', {
    x: 3.5,
    y: 5.5,
    w: 3,
    h: 0.5,
    fontSize: 12,
    color: colors.gray,
    align: 'center',
    fontFace: 'Inter',
  });

  // Return as Buffer
  const pptxBuffer = pptx.write({ outputType: 'buffer' });
  return Buffer.from(pptxBuffer);
}
