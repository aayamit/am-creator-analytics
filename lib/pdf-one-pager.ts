/**
 * PDF Export: One-Pager
 * Converts marketing/one-pager.md to branded PDF
 * Uses jspdf + jspdf-autotable
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { prisma } from './prisma';

interface OnePagerData {
  companyName: string;
  tagline: string;
  valueProposition: string;
  keyFeatures: Array<{ feature: string; benefit: string }>;
  traction: {
    creators: number;
    brands: number;
    spend: string;
    rating: string;
  };
  pricing: Array<{ plan: string; price: string; target: string }>;
  competitiveAdvantage: Array<{ feature: string; amCreator: string; competitors: string }>;
  contact: {
    demo: string;
    github: string;
    email: string;
  };
}

export async function generateOnePagerPDF(tenantId: string): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Colors (Bloomberg × McKinsey)
  const colors = {
    background: '#F8F7F4',
    primary: '#1a1a2e',
    accent: '#92400e',
    success: '#16a34a',
    error: '#dc2626',
    gray: '#6b7280',
  };

  let yPosition = 20;

  // Helper: Add text with word wrap
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    const fontSize = options.fontSize || 12;
    const fontStyle = options.fontStyle || 'normal';
    const textColor = options.textColor || colors.primary;
    
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.setTextColor(textColor);
    
    const lines = doc.splitTextToSize(text, options.maxWidth || 170);
    doc.text(lines, x, y);
    
    return y + (lines.length * fontSize * 0.5) + (options.marginBottom || 5);
  };

  // 1. Header
  doc.setFillColor(colors.background);
  doc.rect(0, 0, 210, 297, 'F'); // A4 size

  // Company name
  yPosition = addText('AM CREATOR ANALYTICS', 105, yPosition, {
    fontSize: 24,
    fontStyle: 'bold',
    textColor: colors.primary,
    maxWidth: 180,
  }) + 5;

  // Tagline
  yPosition = addText('The Operating System for Creator Economy', 105, yPosition, {
    fontSize: 14,
    fontStyle: 'normal',
    textColor: colors.gray,
    maxWidth: 180,
  }) + 10;

  // Value proposition (highlighted box)
  doc.setFillColor('#fef3c7');
  doc.rect(20, yPosition - 5, 170, 20, 'F');
  yPosition = addText('Save ₹80K-2L/month with our open-source stack vs competitors', 105, yPosition, {
    fontSize: 12,
    fontStyle: 'bold',
    textColor: colors.accent,
    maxWidth: 160,
  }) + 20;

  // 2. Key Features
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('KEY FEATURES', 20, yPosition);
  yPosition += 10;

  const features = [
    { feature: 'Creator Management', benefit: 'Onboard 500+ creators, track earnings' },
    { feature: 'Campaign Tracking', benefit: 'Real-time ROI, engagement metrics' },
    { feature: 'Automated Contracts', benefit: 'OpenSign integration (save ₹20K/month)' },
    { feature: 'Instant Payouts', benefit: 'Stripe Connect (save 30 days wait)' },
    { feature: 'DPDPA Compliance', benefit: 'Built-in (save ₹50K in fines)' },
    { feature: 'Mobile App', benefit: 'React Native (check earnings on-go)' },
  ];

  const featureRows = features.map(f => [f.feature, f.benefit]);
  (doc as any).autoTable({
    startY: yPosition,
    head: [['Feature', 'Benefit']],
    body: featureRows,
    theme: 'grid',
    headStyles: { fillColor: colors.primary, textColor: '#FFFFFF' },
    margin: { left: 20, right: 20 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // 3. Traction
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('IMPPRESSIVE TRACTION', 20, yPosition);
  yPosition += 10;

  const tractionData = [
    ['Creators Onboarded', '500+'],
    ['Brands Using', '50+'],
    ['Campaign Spend Tracked', '₹10L+'],
    ['Customer Rating', '4.8/5 stars'],
    ['Creator Retention', '92%'],
  ];

  (doc as any).autoTable({
    startY: yPosition,
    body: tractionData,
    theme: 'plain',
    styles: { fontSize: 11 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: colors.primary },
      1: { textColor: colors.accent },
    },
    margin: { left: 20, right: 20 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // 4. Pricing
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('SIMPLE PRICING', 20, yPosition);
  yPosition += 10;

  const pricingData = [
    ['Starter', '₹0/month', 'Individual creators'],
    ['Professional', '₹299/month', 'Small brands'],
    ['Elite', '₹999/month', 'Agencies'],
  ];

  (doc as any).autoTable({
    startY: yPosition,
    head: [['Plan', 'Price', 'Target']],
    body: pricingData,
    theme: 'striped',
    headStyles: { fillColor: colors.primary, textColor: '#FFFFFF' },
    margin: { left: 20, right: 20 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // 5. Competitive Advantage
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('COMPETITIVE ADVANTAGE', 20, yPosition);
  yPosition += 10;

  const compData = [
    ['Open-Source Savings', '₹80K-2L/month', '❌ Pay 5x more'],
    ['Premium Design', 'Bloomberg × McKinsey', '❌ Basic UI'],
    ['Multi-Language', '5 languages', '❌ English only'],
    ['Self-Hosted', 'Full control', '❌ SaaS only'],
  ];

  (doc as any).autoTable({
    startY: yPosition,
    head: [['Feature', 'AM Creator', 'Competitors']],
    body: compData,
    theme: 'grid',
    headStyles: { fillColor: colors.primary, textColor: '#FFFFFF' },
    margin: { left: 20, right: 20 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // 6. Technology Stack
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text('TECHNOLOGY STACK (All Open-Source!)', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.gray);
  const techStack = 'Next.js 15, React 18, TypeScript, Prisma, PostgreSQL, MinIO (storage), MeiliSearch (search), Redis (caching), OpenSign (contracts), Nango (CRM sync)';
  const techLines = doc.splitTextToSize(techStack, 170);
  doc.text(techLines, 20, yPosition);
  yPosition += (techLines.length * 5) + 10;

  // 7. Contact & Demo
  doc.setFillColor(colors.primary);
  doc.rect(20, yPosition - 5, 170, 25, 'F');

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#FFFFFF');
  doc.text('CONTACT & DEMO', 105, yPosition + 5, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Live Demo: https://am-creator-analytics.vercel.app', 105, yPosition + 12, { align: 'center' });
  doc.text('GitHub: https://github.com/[user]/am-creator-analytics', 105, yPosition + 17, { align: 'center' });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(colors.gray);
  doc.text('AM Creator Analytics © 2026 | Bloomberg × McKinsey Design', 105, 290, { align: 'center' });

  // Return as Buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}
