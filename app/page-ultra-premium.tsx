'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  TrendingUp, DollarSign, Users, BarChart3, Shield, ChevronRight,
  Globe, Star, FileText, Wallet, Target, Clock, ArrowRight,
  CheckCircle, Zap, Linkedin, Instagram, Youtube, Twitter,
  Facebook, Mail, Phone, Quote, Award, Lock, Gauge,
  Layers, Sparkles, Rocket, Building2, LineChart, PieChart
} from 'lucide-react';

// Premium animation variants
const ultraFadeIn = {
  hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  }
};

const ultraScale = {
  hidden: { opacity: 0, scale: 0.8, rotate: -2 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerUltra = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Integration logos for trust bar
const integrations = [
  { name: 'YouTube', icon: Youtube },
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'Instagram', icon: Instagram },
  { name: 'Twitter', icon: Twitter },
  { name: 'Facebook', icon: Facebook },
  { name: 'Stripe', icon: Wallet },
  { name: 'Cashfree', icon: DollarSign },
  { name: 'OpenSign', icon: FileText },
  { name: 'Nango', icon: Zap },
  { name: 'MinIO', icon: Layers },
];

// Live metrics for social proof
const liveMetrics = [
  { label: 'Active Brands', value: '500+', icon: Building2 },
  { label: 'Creators', value: '10,000+', icon: Users },
  { label: 'Campaigns Tracked', value: '50,000+', icon: LineChart },
  { label: 'Revenue Attributed', value: '$12M+', icon: DollarSign },
];

// Premium testimonials
const testimonials = [
  {
    quote: "Cut our CAC from $1,800 to $720 in 3 months. This isn't just analytics — it's a revenue engine.",
    author: "Sarah Chen",
    role: "VP Marketing, TechCorp",
    company: "TechCorp Solutions"
  },
  {
    quote: "Finally, a platform that speaks B2B. Full-funnel attribution changed how we evaluate creators.",
    author: "Raj Patel",
    role: "Head of Growth, DataFlow",
    company: "DataFlow Systems"
  },
  {
    quote: "Saved ₹50K/year on DocuSign alone. The open-source stack is genius.",
    author: "Priya Sharma",
    role: "CEO, CloudScale",
    company: "CloudScale Inc"
  }
];

export default function UltraPremiumLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: false });

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div 
      className="min-h-screen bg-background text-foreground font-sans overflow-hidden"
      style={{ 
        backgroundColor: '#F8F7F4', 
        color: '#1a1a2e', 
        fontFamily: "'Inter', -apple-system, sans-serif",
        scrollBehavior: 'smooth'
      }}
      onMouseMove={handleMouseMove}
    >
      
      {/* ========== ULTRA PREMIUM HERO ========== */}
      <motion.section 
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, #1a1a2e 0%, #2d2d44 50%, #F8F7F4 100%)',
          padding: '200px 24px 120px',
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        initial="hidden"
        animate={isHeroInView ? "visible" : "hidden"}
        variants={staggerUltra}
      >
        {/* Animated background grid */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(146,64,14,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(146,64,14,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.6
          }}
        />

        {/* Floating orbs */}
        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(146,64,14,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            zIndex: 0
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(26,26,46,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            zIndex: 0
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Trust badge */}
          <motion.div 
            variants={ultraFadeIn}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(146,64,14,0.1)',
              border: '1px solid rgba(146,64,14,0.2)',
              borderRadius: '50px',
              padding: '8px 20px',
              marginBottom: '32px',
              fontSize: '14px',
              color: '#92400e',
              fontWeight: 500
            }}
          >
            <Sparkles size={16} />
            <span>India's First B2B Influencer Attribution Platform</span>
            <Sparkles size={16} />
          </motion.div>

          {/* Main headline with gradient text */}
          <motion.h1 
            variants={ultraFadeIn}
            style={{
              fontSize: 'clamp(56px, 7vw, 96px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '32px',
              color: '#F8F7F4',
              textShadow: '0 4px 30px rgba(146,64,14,0.3)'
            }}
          >
            Influence,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #92400e 0%, #c2954a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Quantified.</span>
            <br />
            Pipeline,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #92400e 0%, #c2954a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Verified.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={ultraFadeIn}
            style={{
              fontSize: '22px',
              lineHeight: 1.7,
              maxWidth: '750px',
              margin: '0 auto 48px',
              color: 'rgba(248,247,244,0.7)',
              fontWeight: 400
            }}
          >
            Stop measuring vanity metrics. Start tracking{' '}
            <strong style={{ color: '#F8F7F4', fontWeight: 600 }}>
              real B2B business outcomes
            </strong>{' '}
            with full-funnel attribution that proves ROI.
          </motion.p>

          {/* Dual CTAs */}
          <motion.div 
            variants={ultraFadeIn}
            style={{ 
              display: 'flex', 
              gap: '16px', 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              marginBottom: '64px'
            }}
          >
            <a href="/signup?role=BRAND" style={{ textDecoration: 'none' }}>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(146,64,14,0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, #92400e 0%, #c2954a 100%)',
                  color: '#F8F7F4',
                  padding: '20px 48px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 30px rgba(146,64,14,0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                I'm a Brand <ChevronRight size={20} />
              </motion.button>
            </a>
            <a href="/signup?role=CREATOR" style={{ textDecoration: 'none' }}>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(26,26,46,0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  backgroundColor: '#F8F7F4',
                  color: '#1a1a2e',
                  padding: '20px 48px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 700,
                  border: '2px solid rgba(248,247,244,0.3)',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease'
                }}
              >
                I'm a Creator <ChevronRight size={20} />
              </motion.button>
            </a>
          </motion.div>

          {/* Live metrics bar */}
          <motion.div 
            variants={ultraFadeIn}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              maxWidth: '900px',
              margin: '0 auto',
              padding: '32px',
              backgroundColor: 'rgba(248,247,244,0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(248,247,244,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {liveMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <metric.icon size={24} style={{ color: '#92400e', marginBottom: '8px' }} />
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: 800, 
                  color: '#F8F7F4',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: '4px'
                }}>
                  {metric.value}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(248,247,244,0.6)' }}>
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(248,247,244,0.4)',
            fontSize: '12px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const
          }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>Scroll to explore</span>
          <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} />
        </motion.div>
      </motion.section>

      {/* ========== INTEGRATION TRUST BAR ========== */}
      <section style={{
        backgroundColor: '#F8F7F4',
        padding: '48px 24px',
        borderTop: '1px solid rgba(26,26,46,0.1)',
        borderBottom: '1px solid rgba(26,26,46,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '32px',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            fontWeight: 500
          }}>
            Trusted integrations & platforms
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '48px',
            flexWrap: 'wrap' as const
          }}>
            {integrations.map((integration) => (
              <motion.div
                key={integration.name}
                whileHover={{ scale: 1.1, opacity: 1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#4b5563',
                  fontSize: '16px',
                  fontWeight: 500,
                  opacity: 0.6,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <integration.icon size={24} />
                <span>{integration.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROBLEM SECTION (Enhanced) ========== */}
      <motion.section
        style={{ 
          backgroundColor: '#1a1a2e',
          color: '#F8F7F4',
          padding: '140px 24px',
          position: 'relative',
          overflow: 'hidden'
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerUltra}
      >
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(146,64,14,0.08) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, rgba(146,64,14,0.08) 0%, transparent 50%)`,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div variants={ultraFadeIn}>
            <span style={{
              fontSize: '14px',
              color: '#92400e',
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              marginBottom: '16px',
              display: 'block'
            }}>
              The Problem
            </span>
            <h2 style={{
              fontSize: 'clamp(48px, 6vw, 80px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '24px'
            }}>
              The <span style={{ color: '#92400e' }}>Vanity Metric</span> Trap
            </h2>
            <p style={{
              fontSize: '20px',
              lineHeight: 1.7,
              color: '#9ca3af',
              maxWidth: '700px',
              margin: '0 auto 60px'
            }}>
              Generic SaaS metrics don't close B2B deals. Here's why traditional influencer marketing is draining your P&L.
            </p>
          </motion.div>

          {/* Problem stats with premium styling */}
          <motion.div 
            variants={staggerUltra}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '32px',
              fontFamily: "'JetBrains Mono', monospace"
            }}
          >
            {[
              { value: '$1,200', label: 'Avg B2B SaaS CAC', color: '#F8F7F4' },
              { value: '134 days', label: 'Avg Sales Cycle', color: '#F8F7F4' },
              { value: '90%', label: 'Campaign Fail Rate', color: '#92400e' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={ultraScale}
                style={{
                  padding: '32px',
                  backgroundColor: 'rgba(248,247,244,0.03)',
                  borderRadius: '16px',
                  border: '1px solid rgba(248,247,244,0.1)',
                  textAlign: 'center' as const
                }}
              >
                <div style={{
                  fontSize: '48px',
                  fontWeight: 800,
                  color: stat.color,
                  marginBottom: '8px'
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ========== SOLUTION SECTION (Enhanced Flow) ========== */}
      <motion.section
        style={{ 
          padding: '120px 24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerUltra}
      >
        <motion.div variants={ultraFadeIn} style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span style={{
            fontSize: '14px',
            color: '#92400e',
            fontWeight: 600,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            marginBottom: '16px',
            display: 'block'
          }}>
            The Solution
          </span>
          <h2 style={{
            fontSize: 'clamp(48px, 6vw, 80px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '24px',
            color: '#1a1a2e'
          }}>
            How We <span style={{ color: '#92400e' }}>Solve</span> It
          </h2>
          <p style={{
            fontSize: '18px',
            lineHeight: 1.7,
            maxWidth: '600px',
            margin: '0 auto',
            color: '#4b5563'
          }}>
            Interactive flow diagram with premium B2B outcomes
          </p>
        </motion.div>

        {/* Enhanced solution cards */}
        {[
          {
            step: 1,
            title: "Full-Funnel Attribution",
            description: "Track from first impression to closed-won revenue. No more attribution black holes.",
            metric: "$8.20 ROI per $1 spent",
            icon: BarChart3,
            color: '#1a1a2e',
            bgColor: '#F8F7F4'
          },
          {
            step: 2,
            title: "Live Media Kits (API-Driven)",
            description: "Replace static PDFs with live, API-connected dashboards. Data refreshes daily.",
            metric: "68% less stale data",
            icon: Star,
            color: '#92400e',
            bgColor: '#F8F7F4'
          },
          {
            step: 3,
            title: "Premium Creator Search",
            description: "Filter by 8.7% B2B engagement rates. Flag bots. Verify authenticity.",
            metric: "40% higher lead quality",
            icon: Users,
            color: '#1a1a2e',
            bgColor: '#F8F7F4'
          },
          {
            step: 4,
            title: "OpenSign E-Signature",
            description: "Send contracts in 1 click. Save ₹50K/year vs DocuSign. Audit trails included.",
            metric: "₹50K/year saved",
            icon: FileText,
            color: '#92400e',
            bgColor: '#F8F7F4'
          },
          {
            step: 5,
            title: "Cashfree Payouts + GST",
            description: "Automated payouts in 24hrs. GST-ready invoices auto-generated.",
            metric: "₹1,500 signing bonus",
            icon: Wallet,
            color: '#1a1a2e',
            bgColor: '#F8F7F4'
          }
        ].map((solution, index) => (
          <motion.div
            key={solution.step}
            variants={ultraScale}
            style={{
              display: 'flex',
              gap: '32px',
              alignItems: 'flex-start',
              padding: '48px',
              marginBottom: '32px',
              backgroundColor: solution.bgColor,
              borderRadius: '20px',
              borderLeft: `4px solid ${solution.color}`,
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              flexDirection: index % 2 === 0 ? 'row' : 'row-reverse'
            }}
            whileHover={{ 
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              transform: 'translateY(-4px)'
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: solution.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '28px',
              fontWeight: 800,
              color: '#F8F7F4'
            }}>
              {solution.step}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <solution.icon size={24} style={{ color: solution.color }} />
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#1a1a2e',
                  margin: 0
                }}>
                  {solution.title}
                </h3>
              </div>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.7,
                color: '#4b5563',
                marginBottom: '16px'
              }}>
                {solution.description}
              </p>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '20px',
                fontWeight: 800,
                color: solution.color
              }}>
                {solution.metric}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* ========== TESTIMONIALS (New Premium Section) ========== */}
      <motion.section
        style={{
          backgroundColor: '#1a1a2e',
          color: '#F8F7F4',
          padding: '120px 24px'
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerUltra}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div variants={ultraFadeIn} style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span style={{
              fontSize: '14px',
              color: '#92400e',
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              marginBottom: '16px',
              display: 'block'
            }}>
              Social Proof
            </span>
            <h2 style={{
              fontSize: 'clamp(48px, 6vw, 80px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1
            }}>
              Trusted by <span style={{ color: '#92400e' }}>B2B Leaders</span>
            </h2>
          </motion.div>

          <motion.div 
            variants={staggerUltra}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '32px'
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={ultraScale}
                style={{
                  padding: '40px',
                  backgroundColor: 'rgba(248,247,244,0.03)',
                  borderRadius: '20px',
                  border: '1px solid rgba(248,247,244,0.1)',
                  position: 'relative' as const
                }}
              >
                <Quote size={32} style={{ color: '#92400e', marginBottom: '20px', opacity: 0.6 }} />
                <p style={{
                  fontSize: '16px',
                  lineHeight: 1.8,
                  color: '#9ca3af',
                  marginBottom: '24px',
                  fontStyle: 'italic' as const
                }}>
                  "{testimonial.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#92400e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#F8F7F4'
                  }}>
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#F8F7F4' }}>
                      {testimonial.author}
                    </div>
                    <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                      {testimonial.role}
                    </div>
                    <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 500 }}>
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ========== FINAL CTA (Ultra Premium) ========== */}
      <motion.section
        style={{
          padding: '140px 24px',
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto'
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerUltra}
      >
        <motion.div variants={ultraFadeIn}>
          <Sparkles size={48} style={{ color: '#92400e', marginBottom: '24px' }} />
          <h2 style={{
            fontSize: 'clamp(48px, 6vw, 80px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '24px',
            color: '#1a1a2e'
          }}>
            Ready to <span style={{ color: '#92400e' }}>Quantify</span> Your Influence?
          </h2>
          <p style={{
            fontSize: '20px',
            lineHeight: 1.7,
            color: '#4b5563',
            maxWidth: '700px',
            margin: '0 auto 48px'
          }}>
            Join 500+ B2B brands and 10,000+ creators who've quantified their influence. Start your free trial today — no credit card required.
          </p>
        </motion.div>

        <motion.div 
          variants={ultraFadeIn}
          style={{ 
            display: 'flex', 
            gap: '16px', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginBottom: '48px'
          }}
        >
          <a href="/signup?role=BRAND" style={{ textDecoration: 'none' }}>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(26,26,46,0.3)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
                color: '#F8F7F4',
                padding: '20px 48px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 30px rgba(26,26,46,0.2)'
              }}
            >
              Start Brand Trial <ArrowRight size={20} />
            </motion.button>
          </a>
          <a href="/signup?role=CREATOR" style={{ textDecoration: 'none' }}>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(146,64,14,0.3)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(135deg, #92400e 0%, #c2954a 100%)',
                color: '#F8F7F4',
                padding: '20px 48px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 30px rgba(146,64,14,0.2)'
              }}
            >
              Create Creator Account <ArrowRight size={20} />
            </motion.button>
          </a>
        </motion.div>

        {/* Trust indicators */}
        <motion.div 
          variants={ultraFadeIn}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap',
            fontSize: '14px',
            color: '#9ca3af'
          }}
        >
          {[
            { icon: Shield, text: 'DPDP Act 2023 Compliant' },
            { icon: Lock, text: 'SOC2 Type II Ready' },
            { icon: Award, text: 'Open-Source Stack' }
          ].map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <item.icon size={16} style={{ color: '#92400e' }} />
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.section>

    </div>
  );
}
