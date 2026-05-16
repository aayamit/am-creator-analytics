'use client';

import Link from 'next/link';
import { useState } from 'react';
import ROICalculator from '@/components/ROICalculator';

export default function MarketingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Typography */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 text-sm font-medium">
              The Next Evolution of Influencer Marketing in India 🇮🇳
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Stop Paying Agency Markups. <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Scale Your Creator ROI In-House.
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl">
              We don't just scrape social media. Access an exclusive network of 15,000+ actively onboarded, verified Indian creators through a powerful SaaS platform. Discover talent, negotiate contracts, track e-commerce sales, and process payouts—all in one place, with zero middlemen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/api/auth/signin?callbackUrl=/dashboard"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity text-center"
              >
                Start Your 14-Day Free Trial
              </Link>
              <Link
                href="/roi-calculator"
                className="px-8 py-4 rounded-full border border-slate-600 text-white font-semibold hover:bg-slate-800 transition-colors text-center"
              >
                Calculate Your ROI
              </Link>
            </div>
            <div className="text-sm text-slate-400">
              Trusted by 50+ modern Indian brands to scale their performance marketing.
            </div>
            {/* Placeholder brand logos */}
            <div className="flex flex-wrap gap-6 items-center opacity-70">
              {['Beauty Brand', 'Tech Startup', 'Fashion Label', 'Food Chain'].map((brand) => (
                <div key={brand} className="px-4 py-2 bg-slate-800 rounded-lg text-sm text-slate-300">
                  {brand}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Animated Dashboard Placeholder */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 shadow-2xl">
              <div className="text-sm text-slate-400 mb-4">Campaign Dashboard Preview</div>
              <div className="space-y-3">
                {['Pending', 'Contract Signed', 'Sales Tracked'].map((status, i) => (
                  <div key={status} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-blue-400' : 'bg-green-400'}`} />
                      <span className="text-sm">{status}</span>
                    </div>
                    <div className="text-xs text-slate-500">Creator Profile {i+1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1.5: INTEGRATIONS BAR */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8">
            Seamlessly integrates with the tools your growth team already uses:
          </p>
          <div className="flex gap-8 items-center animate-marquee whitespace-nowrap">
            {['Shopify', 'WooCommerce', 'Instagram API', 'YouTube', 'Meta Ads', 'WhatsApp Business', 'Razorpay', 'Stripe'].map((integration) => (
              <div key={integration} className="px-6 py-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200">
                {integration}
              </div>
            ))}
            {/* Duplicate for infinite scroll effect */}
            {['Shopify', 'WooCommerce', 'Instagram API', 'YouTube', 'Meta Ads', 'WhatsApp Business', 'Razorpay', 'Stripe'].map((integration) => (
              <div key={`${integration}-dup`} className="px-6 py-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200">
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: PROBLEM VS SOLUTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            The Creator Economy is Broken. We Fixed the Supply Chain.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
            Traditional influencer tools just hand you a database of scraped, outdated profiles. You're still left doing the heavy lifting: hunting for contact info, begging for replies on personal WhatsApp numbers, and chasing down signed PDFs. It's time to upgrade.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Old Way */}
            <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold mb-6 text-slate-500 dark:text-slate-400">The Old Way</h3>
              <ul className="space-y-4">
                {[
                  'Scraped, Dead Data: 60% of emails bounce or get ignored.',
                  'Agency Taxes: Hidden 20-30% markups on creator fees.',
                  'Legal Nightmares: Chasing PDFs, messy email threads, and zero content rights protection.',
                  'Hostage Data: Agencies own the relationships and mask the true performance metrics.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                    <span className="text-red-500 mt-1">❌</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Our Platform */}
            <div className="p-8 bg-blue-50 dark:bg-slate-800 rounded-2xl border-2 border-blue-200 dark:border-blue-900">
              <h3 className="text-xl font-semibold mb-6 text-blue-600 dark:text-blue-400">Our Platform</h3>
              <ul className="space-y-4">
                {[
                  'Pre-Onboarded Creators: 100% of our creators are registered and actively seeking brand deals.',
                  'Zero Middlemen: You own the relationship and pay 0% commission on creator fees.',
                  'Automated Contracting: Built-in templates, seamless negotiation, and 1-click e-signatures.',
                  '100% Data Ownership: You own all creator relationships, campaign data, and historical analytics forever.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                    <span className="text-green-500 mt-1">✅</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CREATOR VETTING & NICHES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            15,000+ Verified Creators. Zero Fake Followers.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12">
            Stop burning budget on bots and engagement pods. Because we actively onboard our creators, every profile in our ecosystem undergoes a strict verification process.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { icon: '🛡️', title: 'API-Verified Audiences', desc: 'Real demographics from Meta and Google' },
              { icon: '🎯', title: 'The "Fat Middle"', desc: 'Micro/mid-tier creators across Tier 1-3 India' },
              { icon: '⚡', title: '90% Response Rate', desc: 'Instant WhatsApp API pings' },
            ].map((badge) => (
              <div key={badge.title} className="p-6 bg-white dark:bg-slate-700 rounded-xl shadow-sm max-w-xs">
                <div className="text-3xl mb-3">{badge.icon}</div>
                <h4 className="font-semibold mb-2">{badge.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{badge.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['💄 Beauty & Skincare', '📱 Tech & Gadgets', '📈 Finfluencers', '👗 Fashion & Apparel', '🎮 Gaming', '🥑 Health & Wellness'].map((niche) => (
              <span key={niche} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-full text-sm font-medium">
                {niche}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            From Onboarding to Your First Live Campaign in Under 48 Hours.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Discover & Match (Instantly)',
                desc: 'Use precision filters to find verified creators based on real engagement rates, audience demographics, and vernacular languages.',
              },
              {
                step: 2,
                title: 'Negotiate & Collaborate (Seamlessly)',
                desc: 'Bulk-pitch hundreds of creators instantly. Negotiate deliverables, auto-generate contracts with e-signatures, and approve drafts directly in the CRM.',
              },
              {
                step: 3,
                title: 'Track & Pay (Automatically)',
                desc: 'Generate unique affiliate links and promo codes with one click. Watch sales roll in, and execute one-click payouts with GST/TDS compliance.',
              },
            ].map((item) => (
              <div key={item.step} className="p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CORE FEATURES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Everything You Need to Turn Creators into a Performance Channel.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'The "Active Supply" CRM',
                desc: 'Bulk-pitch up to 500 creators with a single click. Manage every response from one centralized dashboard.',
                icon: '📊',
              },
              {
                title: 'Built-in Contracts & E-Signatures',
                desc: 'Auto-generate legally binding agreements, negotiate terms, and get one-click e-signatures.',
                icon: '📝',
              },
              {
                title: 'Product Seeding & Barter Logistics',
                desc: 'Track product dispatch logistics effortlessly. Reduce product wastage by 90% with total visibility.',
                icon: '📦',
              },
              {
                title: 'E-commerce Revenue Attribution',
                desc: 'Connect your store and track exactly which creators are driving cart adds, conversions, and revenue.',
                icon: '🛒',
              },
              {
                title: 'UGC Content Vault',
                desc: 'Secure usage rights via automated contracts and download high-res creator videos for Meta/Google ads.',
                icon: '🎥',
              },
              {
                title: 'Compliant & Secure Payouts',
                desc: 'Handle invoicing, banking details, and 100% of Indian tax compliance (TDS/GST) automatically.',
                icon: '💸',
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: ROI CALCULATOR */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">Why Founders are Ditching Agencies for SaaS</h2>
          <ROICalculator />
        </div>
      </section>

      {/* SECTION 7: SUCCESS STORY */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">Don't Just Take Our Word For It.</h2>
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-700 rounded-2xl p-8 shadow-lg">
            <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-xl mb-6 flex items-center justify-center">
              <div className="text-6xl text-slate-400">▶️</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">40%</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Drop in Customer Acquisition Cost (CAC)</div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3x</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Faster Campaign Turnaround Time</div>
              </div>
            </div>
            <blockquote className="text-lg italic text-slate-600 dark:text-slate-300 mb-6">
              "Before this platform, coordinating with 30 creators meant drowning in WhatsApp chats, chasing signed PDFs, and tracking sales on Excel. Now, we manage 100+ micro-influencers completely in-house, and we can track every single sale back to the creator. It completely transformed our growth engine."
            </blockquote>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              — Founder Name, Founder of Placeholder Fast-Growing D2C Brand
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Do you charge a percentage of our campaign spend?',
                a: 'Absolutely not. We are a pure SaaS platform. You pay a flat monthly or annual subscription fee for the software. What you pay the creators is 100% between you and them.',
              },
              {
                q: 'Are these just macro-influencers, or do you have micro/nano creators?',
                a: 'Our strength is in the "fat middle." We have deeply integrated with thousands of highly-converting micro and mid-tier creators across India who drive massive ROI for D2C brands.',
              },
              {
                q: "What if I'm already working with an agency or have my own spreadsheet of creators?",
                a: 'Take advantage of our Agency Switch Guarantee. Our dedicated team will import your current creator roster into the platform for free in under 24 hours.',
              },
              {
                q: 'Is our campaign and customer data secure?',
                a: '100%. We utilize enterprise-grade encryption and are fully compliant with global GDPR standards and India\'s DPDP Act. You own your data forever.',
              },
            ].map((faq, index) => (
              <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <button
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold">{faq.q}</span>
                  <span className="text-slate-500">{openFaq === index ? '−' : '+'}</span>
                </button>
                {openFaq === index && (
                  <div className="p-6 pt-0 text-slate-600 dark:text-slate-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Stop renting your creator relationships. Start owning them.</h2>
          <p className="text-lg mb-8 opacity-90">
            Get access to the software, the active talent pool, and the tracking tools that will 10x your brand's growth.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-5 rounded-full bg-white text-blue-600 font-bold text-lg hover:bg-slate-100 transition-colors mb-4"
          >
            Start Your 14-Day Free Trial
          </Link>
          <div className="text-sm opacity-80">
            Run your first campaign on us. Cancel anytime. Custom Enterprise plans available.
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Case Studies', 'For Creators', 'Pricing'].map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-white transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Contact', 'Careers'].map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-white transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'DPDP Act & GDPR Compliant'].map((link) => (
                <li key={link}>
                  <Link href="#" className="hover:text-white transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Security</h4>
            <div className="text-sm">Enterprise-Grade Security</div>
            <div className="text-xs mt-2 opacity-70">GDPR & DPDP Act Compliant</div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          © {new Date().getFullYear()} AM Creator Analytics. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
