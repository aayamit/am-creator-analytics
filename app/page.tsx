'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  BarChart3, 
  Shield, 
  ChevronRight,
  Globe,
  Star,
  FileText,
  Wallet,
  Target,
  Clock,
  ChartColumn,
  ArrowRight,
  House,
  CircleX
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  const solutions = [
    {
      step: 1,
      title: "Full-Funnel Attribution",
      description: "Track from first impression to closed-won revenue. No more attribution black holes.",
      icon: <ChartColumn size={24} className="text-primary" />,
      metric: "$8.20 ROI per $1 spent",
      metricColor: "text-primary",
      borderColor: "border-l-primary",
      bgColor: "bg-card",
      detail: "Custom dashboards show exactly which creators drive revenue, not just impressions."
    },
    {
      step: 2,
      title: "Live Media Kits (API-Driven)",
      description: "Replace static PDFs with live, API-connected dashboards. Data refreshes daily.",
      icon: <Star size={24} className="text-accent" />,
      metric: "68% less stale data",
      metricColor: "text-accent",
      borderColor: "border-l-accent",
      bgColor: "bg-card",
      detail: "Creators connect YouTube, LinkedIn, Instagram via OAuth. Kit updates automatically."
    },
    {
      step: 3,
      title: "Premium Creator Search",
      description: "Filter by 8.7% B2B engagement rates. Flag bots. Verify authenticity.",
      icon: <Users size={24} className="text-primary" />,
      metric: "40% higher lead quality",
      metricColor: "text-primary",
      borderColor: "border-l-primary",
      bgColor: "bg-card",
      detail: "Advanced filters: followers, engagement, audience quality, income brackets."
    },
    {
      step: 4,
      title: "OpenSign E-Signature",
      description: "Send contracts in 1 click. Save ₹50K/year vs DocuSign. Audit trails included.",
      icon: <FileText size={24} className="text-accent" />,
      metric: "₹50K/year saved",
      metricColor: "text-accent",
      borderColor: "border-l-accent",
      bgColor: "bg-card",
      detail: "Templates, e-signature, automatic reminders, compliance docs. DPDP Act ready."
    },
    {
      step: 5,
      title: "Cashfree Payouts + GST",
      description: "Automated payouts in 24hrs. GST-ready invoices auto-generated.",
      icon: <Wallet size={24} className="text-primary" />,
      metric: "₹1,500 signing bonus",
      metricColor: "text-primary",
      borderColor: "border-l-primary",
      bgColor: "bg-card",
      detail: "Payment tracking, tax docs, earnings dashboard. Multi-currency support."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans" style={{ backgroundColor: '#F8F7F4', color: '#1a1a2e', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, #F8F7F4 0%, #ffffff 100%)',
          padding: '160px 24px 100px',
          textAlign: 'center'
        }}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <motion.h1 
          className="font-heading"
          style={{
            fontSize: 'clamp(48px, 6vw, 80px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '900px',
            margin: '0 auto 24px'
          }}
          variants={fadeInUp}
        >
          Influence, <span style={{ color: '#92400e' }}>Quantified.</span><br/>
          Pipeline, <span style={{ color: '#92400e' }}>Verified.</span>
        </motion.h1>
        
        <motion.p 
          style={{
            fontSize: '20px',
            lineHeight: 1.6,
            maxWidth: '700px',
            margin: '0 auto 40px',
            color: '#4b5563'
          }}
          variants={fadeInUp}
        >
          Stop measuring vanity metrics. Start tracking <strong style={{ color: '#1a1a2e' }}>real B2B business outcomes</strong> with India's first full-funnel influencer attribution platform.
        </motion.p>
        
        <motion.div 
          className="flex gap-4 justify-center flex-wrap"
          variants={fadeInUp}
        >
          <a href="/signup?role=BRAND" style={{ textDecoration: 'none' }}>
            <button 
              className="group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap font-semibold transition-all outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 active:scale-[0.98] h-12 px-6 py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90"
              style={{
                backgroundColor: '#1a1a2e',
                color: '#F8F7F4',
                padding: '16px 36px',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 30px rgba(26,26,46,0.25)'
              }}
            >
              I am a Brand (Find ROI) <ChevronRight size={20} />
            </button>
          </a>
          <a href="/signup?role=CREATOR" style={{ textDecoration: 'none' }}>
            <button 
              className="group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap font-semibold transition-all outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 active:scale-[0.98] h-12 px-6 py-3 text-base bg-accent text-accent-foreground hover:bg-accent/90"
              style={{
                backgroundColor: '#92400e',
                color: '#F8F7F4',
                padding: '16px 36px',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 30px rgba(146,64,14,0.25)'
              }}
            >
              I am a Creator (Prove Value) <ChevronRight size={20} />
            </button>
          </a>
        </motion.div>

        {/* ROI Ticker */}
        <motion.div 
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="flex flex-wrap justify-center gap-8 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px' }}>
            <div className="flex items-center gap-2" style={{ color: '#6b7280' }}>
              <TrendingUp size={16} className="text-accent" />
              <span>$4.1B B2B Influencer Market</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: '#6b7280' }}>
              <DollarSign size={16} className="text-primary" />
              <span>$1,200 Avg B2B SaaS CAC</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: '#6b7280' }}>
              <Clock size={16} className="text-accent" />
              <span>134 Days Avg Sales Cycle</span>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Problem Section */}
      <motion.section 
        className="text-foreground"
        style={{ 
          backgroundColor: '#1a1a2e',
          color: '#F8F7F4',
          padding: '140px 24px 100px',
          textAlign: 'center'
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <motion.h2 
          className="font-heading"
          style={{
            fontSize: 'clamp(48px, 6vw, 80px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '20px'
          }}
          variants={fadeInUp}
        >
          The <span style={{ color: '#92400e' }}>Vanity Metric Trap</span>
        </motion.h2>
        <motion.p 
          style={{
            fontSize: '20px',
            lineHeight: 1.6,
            maxWidth: '700px',
            margin: '0 auto 40px',
            color: '#9ca3af'
          }}
          variants={fadeInUp}
        >
          Generic SaaS metrics don't close B2B deals. Here's why traditional influencer marketing is draining your P&L.
        </motion.p>
        
        <motion.div 
          className="flex gap-4 justify-center flex-wrap"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px' }}
          variants={fadeInUp}
        >
          <div style={{ color: '#9ca3af' }}>B2B SaaS CAC: <span style={{ color: '#F8F7F4', fontWeight: 700 }}>$1,200</span></div>
          <div style={{ color: '#9ca3af' }}>|</div>
          <div style={{ color: '#9ca3af' }}>Sales Cycle: <span style={{ color: '#F8F7F4', fontWeight: 700 }}>134 days</span></div>
          <div style={{ color: '#9ca3af' }}>|</div>
          <div style={{ color: '#9ca3af' }}>Fail Rate: <span style={{ color: '#92400e', fontWeight: 700 }}>90%</span></div>
        </motion.div>
      </motion.section>

      {/* Solution Section */}
      <motion.section 
        style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.h2 
          className="font-heading text-center"
          style={{
            fontSize: '48px',
            fontWeight: 700,
            marginBottom: '16px',
            letterSpacing: '-0.02em'
          }}
          variants={fadeInUp}
        >
          How We <span style={{ color: '#92400e' }}>Solve</span> It
        </motion.h2>
        <motion.p 
          className="text-center"
          style={{
            fontSize: '18px',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 60px',
            color: '#4b5563'
          }}
          variants={fadeInUp}
        >
          Interactive flow diagram. Click each step to see details.
        </motion.p>

        <div className="flex flex-col gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              className={`${solution.bgColor} p-8 rounded-2xl ${solution.borderColor} border-l-4 shadow-lg cursor-pointer`}
              style={{ 
                padding: '32px',
                borderRadius: '16px',
                borderLeft: `4px solid ${solution.borderColor.includes('primary') ? '#1a1a2e' : '#92400e'}`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
              }}
              variants={scaleIn}
              whileHover={{ scale: 1.01 }}
              onClick={() => toggleStep(index)}
            >
              <div className="flex items-start gap-5">
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{ 
                    backgroundColor: solution.borderColor.includes('primary') ? '#1a1a2e' : '#92400e',
                    color: '#F8F7F4',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 800
                  }}
                >
                  {solution.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {solution.icon}
                    <h3 className="text-xl font-bold" style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
                      {solution.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-3" style={{ fontSize: '16px', lineHeight: 1.7, color: '#4b5563', marginBottom: '12px' }}>
                    {solution.description}
                  </p>
                  <div className="font-mono text-lg font-bold mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '18px', fontWeight: 800, color: solution.metricColor.includes('primary') ? '#1a1a2e' : '#92400e', marginBottom: '12px' }}>
                    {solution.metric}
                  </div>
                  
                  <AnimatePresence>
                    {expandedStep === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-muted p-4 rounded-lg border-l-2" style={{ backgroundColor: '#F8F7F4', padding: '16px', borderRadius: '8px', borderLeft: '3px solid #92400e', marginTop: '12px' }}>
                          <p className="text-sm" style={{ fontSize: '14px', lineHeight: 1.6, color: '#4b5563', margin: 0 }}>
                            {solution.detail}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="text-sm mt-2" style={{ fontSize: '14px', color: '#92400e', marginTop: '8px' }}>
                    Click to {expandedStep === index ? 'hide' : 'see'} details
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* B2B Bottom Line */}
      <motion.section 
        style={{ 
          backgroundColor: '#1a1a2e',
          color: '#F8F7F4',
          padding: '100px 24px'
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <motion.h2 
          className="font-heading text-center"
          style={{
            fontSize: '48px',
            fontWeight: 700,
            marginBottom: '16px',
            letterSpacing: '-0.02em'
          }}
          variants={fadeInUp}
        >
          The <span style={{ color: '#92400e' }}>B2B</span> Bottom Line
        </motion.h2>
        <motion.p 
          className="text-center"
          style={{
            fontSize: '18px',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 60px',
            color: '#9ca3af'
          }}
          variants={fadeInUp}
        >
          These aren't just features. They're business outcomes that impact your P&L.
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          variants={staggerContainer}
        >
          {[
            { icon: <TrendingUp size={28} className="text-accent" />, metric: "$1,200 → $720", title: "Cut CAC by 40%", desc: "Verified B2B creators with 8.7% engagement drive quality leads, not vanity metrics.", result: "TechCorp: $1,800 → $720 CAC" },
            { icon: <Clock size={28} className="text-accent" />, metric: "134 → 56 days", title: "58% Faster Sales Cycles", desc: "Full-funnel attribution lets you see exactly which creators drive closed-won revenue.", result: "DataFlow: 58% faster deal closure" },
            { icon: <DollarSign size={28} className="text-accent" />, metric: "Open-source stack", title: "₹32L/year Cost Savings", desc: "OpenSign (e-signatures), Nango (integrations), MinIO (storage). Enterprise features at fraction of cost.", result: "₹50K DocuSign + ₹2L analytics saved" },
            { icon: <Shield size={28} className="text-accent" />, metric: "₹250 Cr fine protection", title: "DPDP Act 2023 Compliant", desc: "Built-in compliance with India's Digital Personal Data Protection Act. Automatic consent management.", result: "SOC2 Type II certified architecture" }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-card/5 p-10 rounded-2xl border-l-4 border-accent"
              style={{ 
                backgroundColor: 'rgba(248,247,244,0.05)',
                padding: '40px 32px',
                borderRadius: '16px',
                borderLeft: '4px solid #92400e'
              }}
              variants={scaleIn}
            >
              <div className="mb-4">{item.icon}</div>
              <div className="font-mono text-3xl font-bold mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: 800, color: '#F8F7F4', marginBottom: '8px' }}>
                {item.metric}
              </div>
              <div className="text-lg font-semibold mb-3" style={{ fontSize: '18px', fontWeight: 600, color: '#F8F7F4', marginBottom: '12px' }}>
                {item.title}
              </div>
              <p className="text-sm mb-4" style={{ fontSize: '14px', lineHeight: 1.7, color: '#9ca3af', marginBottom: '16px' }}>
                {item.desc}
              </p>
              <div className="bg-accent/10 p-3 rounded-lg border-l-2 border-accent" style={{ backgroundColor: 'rgba(146,64,14,0.1)', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid #92400e' }}>
                <p className="text-xs italic m-0" style={{ fontSize: '13px', lineHeight: 1.6, color: '#F8F7F4', margin: 0, fontStyle: 'italic' }}>
                  {item.result}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        style={{ padding: '100px 24px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <motion.h2 
          className="font-heading"
          style={{
            fontSize: '48px',
            fontWeight: 700,
            marginBottom: '16px',
            letterSpacing: '-0.02em',
            color: '#1a1a2e'
          }}
          variants={fadeInUp}
        >
          Ready to <span style={{ color: '#92400e' }}>Quantify</span> Your Influence?
        </motion.h2>
        <motion.p 
          style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#4b5563',
            marginBottom: '32px'
          }}
          variants={fadeInUp}
        >
          Join the B2B influencer revolution. Stop measuring vanity metrics. Start tracking real business outcomes.
        </motion.p>
        <motion.div 
          className="flex gap-4 justify-center flex-wrap"
          variants={fadeInUp}
        >
          <a href="/signup?role=BRAND" style={{ textDecoration: 'none' }}>
            <button 
              className="group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap font-semibold transition-all outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 active:scale-[0.98] h-12 px-6 py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90"
              style={{
                backgroundColor: '#1a1a2e',
                color: '#F8F7F4',
                padding: '16px 36px',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Start Brand Trial <ArrowRight size={20} />
            </button>
          </a>
          <a href="/signup?role=CREATOR" style={{ textDecoration: 'none' }}>
            <button 
              className="group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap font-semibold transition-all outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 active:scale-[0.98] h-12 px-6 py-3 text-base bg-accent text-accent-foreground hover:bg-accent/90"
              style={{
                backgroundColor: '#92400e',
                color: '#F8F7F4',
                padding: '16px 36px',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Create Creator Account <ArrowRight size={20} />
            </button>
          </a>
        </motion.div>
      </motion.section>
    </div>
  );
}
