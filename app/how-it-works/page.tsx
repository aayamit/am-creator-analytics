/**
 * NEW PAGE: How It Works — Flows & Benefits
 * Bloomberg × McKinsey Design
 * Entirely dedicated to showing flows and benefits
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  TrendingUp, DollarSign, BarChart3, Users, Shield, Zap, ChevronRight, 
  CheckCircle2, Star, ArrowRight, Globe, Clock, Target, FileText, Wallet, Mail,
  Linkedin, Instagram, Youtube, Play, Pause
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

const brandFlow = [
  { step: "1", title: "Define ICP", desc: "Set budget, niche, audience demographics, income brackets. Target 9-12 stakeholders in B2B buying committees.", icon: Target, detail: "Filter by industry, company size, decision-maker roles" },
  { step: "2", title: "Premium Search", desc: "Filter by 8.7% engagement (B2B micro-influencers), verify authenticity, flag bots. Save 30+ hours/month on manual verification.", icon: Users, detail: "Advanced filters: followers, engagement rate, audience quality score" },
  { step: "3", title: "Send Contracts", desc: "OpenSign e-signature integration. Save ₹50K/year vs DocuSign. Automated workflow with audit trails.", icon: FileText, detail: "Templates, e-signature, automatic reminders, compliance docs" },
  { step: "4", title: "Track Full-Funnel ROI", desc: "Attribution from first impression to closed-won revenue. $8.20 ROI per dollar spent in top tech verticals.", icon: BarChart3, detail: "Custom dashboards, exportable reports, real-time alerts" },
  { step: "5", title: "Approve Payouts", desc: "Cashfree integration, GST-ready invoices, ₹1,500 signing bonus for 50K+ followers. 24hr payout cycle.", icon: Wallet, detail: "Automated payouts, tax compliance, multi-currency support" },
];

const creatorFlow = [
  { step: "1", title: "Connect Platforms", desc: "OAuth YouTube, LinkedIn, Instagram, Twitter in 1 click. Automatic daily syncs keep data fresh.", icon: Globe, detail: "Secure token storage, automatic daily syncs, multi-account support" },
  { step: "2", title: "Build Live Media Kit", desc: "API-driven kit updates automatically. No PDF obsolescence — data refreshes daily. Shareable public links.", icon: Star, detail: "Custom branding, embeddable widgets, auto-syncs with platforms" },
  { step: "3", title: "Pitch Brands", desc: "3-step wizard to pitch 500+ B2B brands. Get discovered by brands looking for 8.7% engagement rates.", icon: TrendingUp, detail: "Pitch templates, follow-up tracking, response analytics" },
  { step: "4", title: "Get Paid Fast", desc: "Cashfree payouts in 24hrs. GST-ready invoices auto-generated. Command premium rates with data proof.", icon: DollarSign, detail: "Payment tracking, tax docs, earnings dashboard" },
  { step: "5", title: "Grow Audience", desc: "Cross-platform analytics, benchmark against peers. Prove your 8.7% engagement rate to command premium.", icon: BarChart3, detail: "Audience quality scoring, growth trends, benchmark comparisons" },
];

const benefits = [
  {
    metric: "$1,200 → $720",
    label: "CAC Reduction",
    benefit: "Cut Customer Acquisition Cost by 40%",
    desc: "Verified B2B creators with 8.7% engagement drive quality leads, not vanity metrics. Stop wasting budget on impressions that don't convert.",
    proof: "Case study: TechCorp cut CAC from $1,800 to $720",
    color: "#92400e",
    calculation: "Savings: $1,080 per customer × 100 customers = $108,000/year",
  },
  {
    metric: "134 → 56 days",
    label: "Sales Cycle",
    benefit: "Shorten Sales Cycles by 58%",
    desc: "Full-funnel attribution tracking lets you see exactly which creators drive closed-won revenue. No more attribution black holes.",
    proof: "DataFlow Systems: 58% faster deal closure",
    color: "#1a1a2e",
    calculation: "Savings: 78 days × $10K/month burn = $25,333/month saved",
  },
  {
    metric: "90% → 8.7%",
    label: "Engagement Rate",
    benefit: "Micro-Influencers Deliver 10x Engagement",
    desc: "B2B micro-influencers (10K-100K) generate 8.7% engagement vs 0.9% macro-influencers. Quality over quantity.",
    proof: "B2B creators: 8.7% vs B2C: 0.9% engagement",
    color: "#92400e",
    calculation: "ROI: 8.7% ÷ 0.9% = 9.67x better engagement",
  },
  {
    metric: "₹32L/year",
    label: "Cost Savings",
    benefit: "Save ₹32L/year in SaaS Costs",
    desc: "Open-source stack: OpenSign (e-signatures), Nango (integrations), MinIO (storage). Enterprise features at a fraction of the cost.",
    proof: "Save ₹50K/year vs DocuSign alone",
    color: "#1a1a2e",
    calculation: "₹50K (DocuSign) + ₹2L (analytics) + ₹50K (storage) = ₹3L saved",
  },
];

export default function HowItWorksPage() {
  const [activeFlow, setActiveFlow] = useState<"brand" | "creator">("brand");
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  return (
    <div style={{ backgroundColor: "#F8F7F4", color: "#1a1a2e", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      
      {/* ========== HERO ========== */}
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
          How It <span style={{ color: "#92400e" }}>Works</span>
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
          Two streamlined flows. One unified platform. <strong style={{ color: "#1a1a2e" }}>See exactly how we deliver results.</strong>
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
              }}
            >
              I am a Creator (Prove Value) <ChevronRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>

      {/* ========== TOGGLE ========== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ padding: "0 24px 40px", textAlign: "center" }}
      >
        <motion.div variants={fadeInUp} style={{ display: "flex", justifyContent: "center", marginBottom: "60px" }}>
          <div style={{ 
            backgroundColor: "#ffffff", 
            borderRadius: "10px", 
            padding: "4px", 
            display: "flex", 
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}>
            <button
              onClick={() => { setActiveFlow("brand"); setExpandedStep(null); }}
              style={{
                padding: "12px 32px",
                borderRadius: "8px",
                border: "none",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
                backgroundColor: activeFlow === "brand" ? "#1a1a2e" : "transparent",
                color: activeFlow === "brand" ? "#F8F7F4" : "#4b5563",
              }}
            >
              For Brands
            </button>
            <button
              onClick={() => { setActiveFlow("creator"); setExpandedStep(null); }}
              style={{
                padding: "12px 32px",
                borderRadius: "8px",
                border: "none",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
                backgroundColor: activeFlow === "creator" ? "#92400e" : "transparent",
                color: activeFlow === "creator" ? "#F8F7F4" : "#4b5563",
              }}
            >
              For Creators
            </button>
          </div>
        </motion.div>

        {/* ========== FLOW STEPS (DETAILED) ========== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFlow}
            initial={{ opacity: 0, x: activeFlow === "brand" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeFlow === "brand" ? 20 : -20 }}
            transition={{ duration: 0.4 }}
            style={{ 
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            {(activeFlow === "brand" ? brandFlow : creatorFlow).map((step) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: parseInt(step.step) * 0.1 }}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "32px",
                  borderRadius: "16px",
                  borderLeft: `4px solid ${activeFlow === "brand" ? "#1a1a2e" : "#92400e"}`,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  marginBottom: "24px",
                  cursor: "pointer",
                }}
                onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                  <div style={{
                    backgroundColor: activeFlow === "brand" ? "#1a1a2e" : "#92400e",
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
                      <step.icon size={24} color={activeFlow === "brand" ? "#1a1a2e" : "#92400e"} />
                      <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{step.title}</h3>
                    </div>
                    <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#4b5563", marginBottom: "12px" }}>{step.desc}</p>
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
        </AnimatePresence>
      </motion.section>

      {/* ========== BENEFITS (NOT FEATURES) ========== */}
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
              <div style={{ 
                fontFamily: "'JetBrains Mono', monospace", 
                fontSize: "32px", 
                fontWeight: 800, 
                color: "#F8F7F4", 
                marginBottom: "8px",
              }}>
                {benefit.metric}
              </div>
              <div style={{ fontSize: "18px", fontWeight: 600, color: "#F8F7F4", marginBottom: "12px" }}>
                {benefit.label}
              </div>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#9ca3af", marginBottom: "16px" }}>
                {benefit.desc}
              </p>
              <div style={{ backgroundColor: "rgba(146,64,14,0.1)", padding: "12px 16px", borderRadius: "8px", borderLeft: "3px solid #92400e" }}>
                <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#F8F7F4", margin: 0, fontStyle: "italic" }}>{benefit.proof}</p>
              </div>
              <div style={{ 
                marginTop: "16px",
                backgroundColor: "rgba(248,247,244,0.05)", 
                padding: "12px 16px", 
                borderRadius: "8px",
                fontFamily: "'JetBrains Mono', monospace", 
                fontSize: "13px", 
                color: "#92400e",
                fontWeight: 600,
              }}>
                {benefit.calculation}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ========== FINAL CTA ========== */}
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
