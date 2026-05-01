/**
 * Solution Page — Interactive Flows & Benefits
 * Bloomberg × McKinsey Design
 * Focus: How we SOLVE the problems (with flows)
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  TrendingUp, DollarSign, BarChart3, Users, Shield, Zap, ChevronRight, 
  CheckCircle2, Star, ArrowRight, Globe, Clock, Target, FileText, Wallet, 
  Linkedin, Instagram, Youtube, Play, Pause, Eye, ThumbsUp
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const solutionFlows = [
  {
    step: "1",
    title: "Full-Funnel Attribution",
    desc: "Track from first impression to closed-won revenue. No more attribution black holes.",
    icon: BarChart3,
    benefit: "$8.20 ROI per $1 spent",
    detail: "Custom dashboards show exactly which creators drive revenue, not just impressions.",
    color: "#1a1a2e",
  },
  {
    step: "2",
    title: "Live Media Kits (API-Driven)",
    desc: "Replace static PDFs with live, API-connected dashboards. Data refreshes daily.",
    icon: Star,
    benefit: "68% less stale data",
    detail: "Creators connect YouTube, LinkedIn, Instagram via OAuth. Kit updates automatically.",
    color: "#92400e",
  },
  {
    step: "3",
    title: "Premium Creator Search",
    desc: "Filter by 8.7% B2B engagement rates. Flag bots. Verify authenticity.",
    icon: Users,
    benefit: "40% higher lead quality",
    detail: "Advanced filters: followers, engagement, audience quality, income brackets.",
    color: "#1a1a2e",
  },
  {
    step: "4",
    title: "OpenSign E-Signature",
    desc: "Send contracts in 1 click. Save ₹50K/year vs DocuSign. Audit trails included.",
    icon: FileText,
    benefit: "₹50K/year saved",
    detail: "Templates, e-signature, automatic reminders, compliance docs. DPDP Act ready.",
    color: "#92400e",
  },
  {
    step: "5",
    title: "Cashfree Payouts + GST",
    desc: "Automated payouts in 24hrs. GST-ready invoices auto-generated.",
    icon: Wallet,
    benefit: "₹1,500 signing bonus",
    detail: "Payment tracking, tax docs, earnings dashboard. Multi-currency support.",
    color: "#1a1a2e",
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Cut CAC by 40%",
    metric: "$1,200 → $720",
    desc: "Verified B2B creators with 8.7% engagement drive quality leads, not vanity metrics.",
    proof: "TechCorp: $1,800 → $720 CAC",
    color: "#92400e",
  },
  {
    icon: Clock,
    title: "58% Faster Sales Cycles",
    metric: "134 → 56 days",
    desc: "Full-funnel attribution lets you see exactly which creators drive closed-won revenue.",
    proof: "DataFlow: 58% faster deal closure",
    color: "#1a1a2e",
  },
  {
    icon: DollarSign,
    title: "₹32L/year Cost Savings",
    metric: "Open-source stack",
    desc: "OpenSign (e-signatures), Nango (integrations), MinIO (storage). Enterprise features at fraction of cost.",
    proof: "₹50K DocuSign + ₹2L analytics saved",
    color: "#92400e",
  },
  {
    icon: Shield,
    title: "DPDP Act 2023 Compliant",
    metric: "₹250 Cr fine protection",
    desc: "Built-in compliance with India's Digital Personal Data Protection Act. Automatic consent management.",
    proof: "SOC2 Type II certified architecture",
    color: "#1a1a2e",
  },
];

export default function SolutionPage() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  return (
    <div style={{ backgroundColor: "#F8F7F4", color: "#1a1a2e", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      
      {/* ========= HERO ========= */}
      <motion.section
        initial="hidden" animate="visible" variants={fadeInUp}
        style={{ 
          background: "linear-gradient(180deg, #F8F7F4 0%, #ffffff 100%)",
          padding: "160px 24px 100px", 
          textAlign: "center",
        }}
      >
        <motion.h1 
          variants={fadeInUp}
          style={{ 
            fontSize: "clamp(48px, 6vw, 80px)", 
            fontWeight: 800, 
            letterSpacing: "-0.03em", 
            lineHeight: 1.1, 
            marginBottom: "24px",
            maxWidth: "900px",
            margin: "0 auto 24px",
          }}
        >
          The <span style={{ color: "#92400e" }}>Solution</span>
        </motion.h1>

        <motion.p 
          variants={fadeInUp}
          style={{ 
            fontSize: "20px", 
            lineHeight: 1.6, 
            maxWidth: "700px", 
            margin: "0 auto 40px", 
            color: "#4b5563",
          }}
        >
          We don't just track vanity metrics. We deliver <strong style={{ color: "#1a1a2e" }}>full-funnel attribution</strong> that impacts your P&L.
        </motion.p>

        <motion.div variants={fadeInUp} style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup?role=BRAND" style={{ textDecoration: "none" }}>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ 
                backgroundColor: "#1a1a2e", 
                color: "#F8F7F4", 
                padding: "16px 36px", 
                borderRadius: "10px", 
                fontSize: "18px", 
                fontWeight: 600, 
                border: "none", 
                cursor: "pointer",
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                boxShadow: "0 8px 30px rgba(26,26,46,0.25)",
              }}
            >
              I am a Brand (Find ROI) <ChevronRight size={20} />
            </motion.button>
          </Link>
          <Link href="/signup?role=CREATOR" style={{ textDecoration: "none" }}>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ 
                backgroundColor: "#92400e", 
                color: "#F8F7F4", 
                padding: "16px 36px", 
                borderRadius: "10px", 
                fontSize: "18px", 
                fontWeight: 600, 
                border: "none", 
                cursor: "pointer",
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                boxShadow: "0 8px 30px rgba(146,64,14,0.25)",
              }}
            >
              I am a Creator (Prove Value) <ChevronRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>

      {/* ========= SOLUTION FLOW (INTERACTIVE) ========= */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ padding: "100px 24px", maxWidth: "1000px", margin: "0 auto" }}
      >
        <motion.h2 variants={fadeInUp} style={{ fontSize: "48px", fontWeight: 700, textAlign: "center", marginBottom: "16px", letterSpacing: "-0.02em" }}>
          How We <span style={{ color: "#92400e" }}>Solve</span> It
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ fontSize: "18px", lineHeight: 1.6, textAlign: "center", maxWidth: "600px", margin: "0 auto 60px", color: "#4b5563" }}>
          Interactive flow diagram. Click each step to see details.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "24px",
          }}
        >
          {solutionFlows.map((step) => (
            <motion.div
              key={step.step}
              variants={scaleIn}
              style={{
                backgroundColor: "#ffffff",
                padding: "32px",
                borderRadius: "16px",
                borderLeft: `4px solid ${step.color}`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                cursor: "pointer",
              }}
              onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <div style={{
                  backgroundColor: step.color,
                  color: "#F8F7F4",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: 800,
                  flexShrink: 0,
                }}>
                  {step.step}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <step.icon size={24} color={step.color} />
                    <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{step.title}</h3>
                  </div>
                  <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#4b5563", marginBottom: "12px" }}>{step.desc}</p>
                  <div style={{ 
                    fontFamily: "'JetBrains Mono', monospace", 
                    fontSize: "18px", 
                    fontWeight: 800, 
                    color: step.color, 
                    marginBottom: "12px",
                  }}>
                    {step.benefit}
                  </div>
                  <div style={{ 
                    maxHeight: expandedStep === step.step ? "200px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                  }}>
                    <div style={{ 
                      backgroundColor: "#F8F7F4", 
                      padding: "16px", 
                      borderRadius: "8px",
                      borderLeft: "3px solid #92400e",
                      marginTop: "12px",
                    }}>
                      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#4b5563", margin: 0 }}>{step.detail}</p>
                    </div>
                  </div>
                  <div style={{ fontSize: "14px", color: "#92400e", marginTop: "8px" }}>
                    {expandedStep === step.step ? "Click to collapse" : "Click to see details"}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ========= BENEFITS (NOT FEATURES) ========= */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ backgroundColor: "#1a1a2e", color: "#F8F7F4", padding: "100px 24px" }}
      >
        <motion.h2 variants={fadeInUp} style={{ fontSize: "48px", fontWeight: 700, textAlign: "center", marginBottom: "16px", letterSpacing: "-0.02em" }}>
          The <span style={{ color: "#92400e" }}>B2B</span> Bottom Line
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ fontSize: "18px", lineHeight: 1.6, textAlign: "center", maxWidth: "600px", margin: "0 auto 60px", color: "#9ca3af" }}>
          These aren't just features. They're business outcomes that impact your P&L.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
            gap: "32px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index} variants={scaleIn}
              style={{
                backgroundColor: "rgba(248,247,244,0.05)",
                padding: "40px 32px",
                borderRadius: "16px",
                borderLeft: "4px solid #92400e",
              }}
            >
              <benefit.icon size={28} color="#92400e" style={{ marginBottom: "16px" }} />
              <div style={{ 
                fontFamily: "'JetBrains Mono', monospace", 
                fontSize: "28px", 
                fontWeight: 800, 
                color: "#F8F7F4", 
                marginBottom: "8px",
              }}>
                {benefit.metric}
              </div>
              <div style={{ fontSize: "18px", fontWeight: 600, color: "#F8F7F4", marginBottom: "12px" }}>
                {benefit.title}
              </div>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#9ca3af", marginBottom: "16px" }}>
                {benefit.desc}
              </p>
              <div style={{ backgroundColor: "rgba(146,64,14,0.1)", padding: "12px 16px", borderRadius: "8px", borderLeft: "3px solid #92400e" }}>
                <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#F8F7F4", margin: 0, fontStyle: "italic" }}>{benefit.proof}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ========= FINAL CTA ========= */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ 
          padding: "100px 24px", 
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ fontSize: "48px", fontWeight: 700, marginBottom: "16px", color: "#1a1a2e", letterSpacing: "-0.02em" }}>
          Ready to <span style={{ color: "#92400e" }}>Quantify</span> Your Influence?
        </h2>
        <p style={{ fontSize: "18px", lineHeight: 1.6, color: "#4b5563", marginBottom: "32px" }}>
          Join the B2B influencer revolution. Stop measuring vanity metrics. Start tracking real business outcomes.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup?role=BRAND" style={{ textDecoration: "none" }}>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ 
                backgroundColor: "#1a1a2e", 
                color: "#F8F7F4", 
                padding: "16px 36px", 
                borderRadius: "10px", 
                fontSize: "18px", 
                fontWeight: 600, 
                border: "none", 
                cursor: "pointer",
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
              }}
            >
              Start Brand Trial <ChevronRight size={20} />
            </motion.button>
          </Link>
          <Link href="/signup?role=CREATOR" style={{ textDecoration: "none" }}>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ 
                backgroundColor: "#92400e", 
                color: "#F8F7F4", 
                padding: "16px 36px", 
                borderRadius: "10px", 
                fontSize: "18px", 
                fontWeight: 600, 
                border: "none", 
                cursor: "pointer",
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
              }}
            >
              Create Creator Account <ChevronRight size={20} />
            </motion.button>
          </Link>
        </div>
        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "24px", marginBottom: 0 }}>
          No credit card required. Free 14-day trial. Cancel anytime.
        </p>
      </motion.section>
    </div>
  );
}
