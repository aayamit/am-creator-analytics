'use client';

import Link from 'next/link';
import BrandMark from '@/components/BrandMark';

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Creator Discovery', href: '/marketing#modules' },
      { label: 'Campaign CRM', href: '/marketing#modules' },
      { label: 'Contracts', href: '/marketing#modules' },
      { label: 'Attribution', href: '/marketing#modules' },
      { label: 'Payouts', href: '/marketing#modules' },
      { label: 'UGC Vault', href: '/marketing#modules' },
    ],
  },
  {
    title: 'For',
    links: [
      { label: 'Brands', href: '/marketing' },
      { label: 'Creators', href: '/for-creators' },
      { label: 'Agencies', href: '/for-agencies' },
      { label: 'D2C Teams', href: '/for-d2c-brands' },
      { label: 'Founding Partners', href: '/marketing#founding-partners' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'How It Works', href: '/marketing#workflow' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'For D2C Brands', href: '/for-d2c-brands' },
      { label: 'For Agencies', href: '/for-agencies' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer mt-auto bg-[#101827] px-6 py-16 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.2fr_repeat(4,0.8fr)]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <BrandMark
                alt="AM Creator Analytics mark"
                className="h-10 w-10"
                priority
                variant="light"
              />
              <div>
                <p className="text-lg font-semibold text-white">
                  AM Creator Analytics
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                  Performance-led creator campaigns
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              AM Creator Analytics helps brands and creators run measurable,
              compliant, performance-led creator campaigns from discovery to
              payout.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                {column.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="footer-link text-sm text-slate-400 no-underline transition hover:no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} AM Creator Analytics. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link
              href="/marketing#founding-partners"
              className="footer-link no-underline hover:no-underline"
            >
              Founding brand partners
            </Link>
            <Link
              href="/for-creators#founding-creator-program"
              className="footer-link no-underline hover:no-underline"
            >
              Founding creator network
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
