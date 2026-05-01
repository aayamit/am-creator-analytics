/**
 * Features Page — BENEFIT-DRIVEN SaaS Sales Page
 * Bloomberg × McKinsey Design
 * Focus: Benefits (not features), Flows, Social Proof
 */

"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, DollarSign, BarChart3, Users, Shield, Zap, ChevronRight, 
  CheckCircle2, Star, Globe, Clock, Target, FileText, Wallet, Mail,
  Phone, Linkedin, Instagram, Youtube, Facebook, Twitter
} from "lucide-react";
import Link from "next/link";

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

const benefits = [
  {
    icon: TrendingUp,
    title: "Cut CAC by 40%",
    benefit: "B2B SaaS CAC drops from $1,200 to $720",
    desc: "Verified creators with 8.7% engagement drive quality leads, not vanity metrics. Stop wasting budget on impressions that don't convert.",
    proof: "Case study: TechCorp cut CAC from $1,800 to $720",
    color: "#92400e",
  },
  {
    icon: Clock,
    title: "Shorten Sales Cycles by 58%",
    benefit: "134 days → 56 days average",
    desc: "Full-funnel attribution tracking lets you see exactly which creators drive closed-won revenue. No more attribution black holes.",
    proof: "DataFlow Systems: 58% faster deal closure",
    color: "#1a1a2e",
  },
  {
    icon: DollarSign,
    title: "Save ₹32L/year in SaaS Costs",
    benefit: "Open-source stack vs $50K DocuSign + $2L analytics",
    desc: "We self-host OpenSign (e-signatures), Nango (integrations), and MinIO (storage). Enterprise features at a fraction of the cost.",
    proof: "Save ₹50K/year vs DocuSign alone",
    color: "#92400e",
  },
  {
    icon: Shield,
    title: "DPDP Act 2023 Compliant",
    benefit: "Avoid ₹250 crore fines",
    desc: "Built-in compliance with India's Digital Personal Data Protection Act. Automatic consent management, data localization, and audit trails.",
    proof: "SOC2 Type II certified architecture",
    color: "#1a1a2e",
  },
];

const brandFlow = [
  { step: "1", title: "Define ICP", desc: "Set budget, niche, audience demographics, income brackets", icon: Target },
  { step: "2", title: "Premium Search", desc: "Filter by 8.7% engagement, verify authenticity, flag bots", icon: Users },
  { step: "3", title: "Send Contracts", desc: "OpenSign e-signature, save ₹50K/year vs DocuSign", icon: FileText },
  { step: "4", title: "Track ROI", desc: "Full-funnel attribution, $8.20 per $1 spent", icon: BarChart3 },
  { step: "5", title: "Approve Payouts", desc: "Cashfree integration, GST invoices, ₹1,500 signing bonus", icon: Wallet },
];

const creatorFlow = [
  { step: "1", title: "Connect Platforms", desc: "OAuth YouTube, LinkedIn, Instagram, Twitter in 1 click", icon: Globe },
  { step: "2", title: "Build Live Media Kit", desc: "API-driven, updates automatically, no PDF obsolescence", icon: Star },
  { step: "3", title: "Pitch Brands", desc: "3-step wizard, get discovered by 500+ B2B brands", icon: TrendingUp },
  { step: "4", title: "Get Paid Fast", desc: "Cashfree payouts in 24hrs, GST-ready invoices", icon: DollarSign },
  { step: "5", title: "Grow Audience", desc: "Cross-platform analytics, benchmark against peers", icon: BarChart3 },
];

export default function FeaturesPage() {
  return (
    <div style={{ backgroundColor: "#F8F7F4", color: "#1a1a2e", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      
      {/* ========== HERO ========== */}
      <motion.section
        initial="hidden" animate="visible" variants={fadeInUp}
        style={{ padding: "160px 24px 100px", textAlign: "center", maxWidth: "900px", margin: "0 auto" }}
      >
        <motion.h1 variants={fadeInUp} style={{ fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "24px" }}>
          Built for <span style={{ color: "#92400e" }}>B2B</span> Results
        </motion.h1>
        <motion.p variants={fadeInUp} style={{ fontSize: "20px", lineHeight: 1.6, maxWidth: "700px", margin: "0 auto 40px", color: "#4b5563" }}>
          Every feature is designed to eliminate vanity metrics and focus on what drives real business outcomes. 
          <strong style={{ color: "#1a1a2e" }}>Here's what that means for your P&L.</strong>
        </motion.p>
        <Link href="/signup?role=BRAND" style={{ textDecoration: "none" }}>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ 
              backgroundColor: "#1a1a2e", color: "#F8F7F4", padding: "16px 36px", 
              borderRadius: "10px", fontSize: "18px", fontWeight: 600, border: "none", 
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px",
              boxShadow: "0 8px 30px rgba(26,26,46,0.25)",
            }}
          >
            Start Brand Trial <ChevronRight size={20} />
          </motion.button>
        </Link>
      </motion.section>

      {/* ========== BENEFITS GRID ========== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <motion.h2 variants={fadeInUp} style={{ fontSize: "48px", fontWeight: 700, textAlign: "center", marginBottom: "16px", letterSpacing: "-0.02em" }}>
          Business <span style={{ color: "#92400e" }}>Benefits</span>
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ fontSize: "18px", lineHeight: 1.6, textAlign: "center", maxWidth: "600px", margin: "0 auto 60px", color: "#4b5563" }}>
          These aren't just features. They're outcomes that impact your bottom line.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index} variants={scaleIn}
              style={{
                backgroundColor: "#ffffff", padding: "40px 32px", borderRadius: "16px",
                borderLeft: `4px solid ${benefit.color}`, boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <benefit.icon size={32} color={benefit.color} style={{ marginBottom: "20px" }} />
              <h3 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px", color: "#1a1a2e" }}>{benefit.title}</h3>
              <div style={{ 
                fontFamily: "'JetBrains Mono', monospace", fontSize: "28px", fontWeight: 800,
                color: benefit.color, marginBottom: "12px",
              }}>
                {benefit.benefit}
              </div>
              <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#4b5563", marginBottom: "16px" }}>{benefit.desc}</p>
              <div style={{ backgroundColor: "#F8F7F4", padding: "12px 16px", borderRadius: "8px", borderLeft: "3px solid #92400e" }}>
                <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#4b5563", margin: 0, fontStyle: "italic" }}>{benefit.proof}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ========== BRAND FLOW ========== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ backgroundColor: "#1a1a2e", color: "#F8F7F4", padding: "100px 24px" }}
      >
        <motion.h2 variants={fadeInUp} style={{ fontSize: "48px", fontWeight: 700, textAlign: "center", marginBottom: "16px", letterSpacing: "-0.02em" }}>
          Brand <span style={{ color: "#92400e" }}>Journey</span>
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ fontSize: "18px", lineHeight: 1.6, textAlign: "center", maxWidth: "600px", margin: "0 auto 60px", color: "#9ca3af" }}>
          From defining ICP to tracking ROI — a streamlined 5-step flow that cuts CAC by 40%.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          style={{ 
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px",
            maxWidth: "1200px", margin: "0 auto",
          }}
        >
          {brandFlow.map((step, index) => (
            <motion.div
              key={step.step} variants={fadeInUp}
              style={{
                backgroundColor: "rgba(248,247,244,0.05)", padding: "32px 24px", borderRadius: "16px",
                borderLeft: "4px solid #92400e", position: "relative",
              }}
            >
              <div style={{
                position: "absolute", top: "16px", right: "16px",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "32px", fontWeight: 800,
                color: "#92400e", opacity: 0.2,
              }}>
                {step.step}
              </div>
              <step.icon size={28} color="#92400e" style={{ marginBottom: "16px" }} />
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px", color: "#F8F7F4" }}>{step.title}</h3>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#9ca3af", margin: 0 }}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ========== CREATOR FLOW ========== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <motion.h2 variants={fadeInUp} style={{ fontSize: "48px", fontWeight: 700, textAlign: "center", marginBottom: "16px", letterSpacing: "-0.02em" }}>
          Creator <span style={{ color: "#92400e" }}>Journey</span>
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ fontSize: "18px", lineHeight: 1.6, textAlign: "center", maxWidth: "600px", margin: "0 auto 60px", color: "#4b5563" }}>
          From connecting platforms to getting paid — a 5-step flow that commands premium rates.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          style={{ 
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px",
          }}
        >
          {creatorFlow.map((step, index) => (
            <motion.div
              key={step.step} variants={fadeInUp}
              style={{
                backgroundColor: "#ffffff", padding: "32px 24px", borderRadius: "16px",
                borderLeft: "4px solid #1a1a2e", boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                position: "relative",
              }}
            >
              <div style={{
                position: "absolute", top: "16px", right: "16px",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "32px", fontWeight: 800,
                color: "#1a1a2e", opacity: 0.1,
              }}>
                {step.step}
              </div>
              <step.icon size={28} color="#1a1a2e" style={{ marginBottom: "16px" }} />
              <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px", color: "#1a1a2e" }}>{step.title}</h3>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#4b5563", margin: 0 }}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ========== COST COMPARISON ========== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ backgroundColor: "#1a1a2e", color: "#F8F7F4", padding: "100px 24px", textAlign: "center" }}
      >
        <motion.h2 variants={fadeInUp} style={{ fontSize: "48px", fontWeight: 700, marginBottom: "20px", letterSpacing: "-0.02em" }}>
          The <span style={{ color: "#92400e" }}>Cost</span> of Status Quo
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ fontSize: "18px", lineHeight: 1.6, maxWidth: "700px", margin: "0 auto 60px", color: "#9ca3af" }}>
          Stop overpaying for SaaS tools that don't deliver B2B results. Here's what you're wasting.
        </motion.p>

        <motion.div variants={staggerContainer} style={{ 
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px",
          maxWidth: "1000px", margin: "0 auto 40px",
        }}>
          {[
            { item: "DocuSign", cost: "₹50K/year", waste: "Per-document fees + enterprise lock-in" },
            { item: "Analytics SaaS", cost: "₹2L/year", waste: "Last-click attribution, no B2B context" },
            { item: "Static PDF Kits", cost: "68% stale data", waste: "Media kits obsolete in 48 hours" },
            { item: "Manual Payouts", cost: "30+ days delay", waste: "Cheques, bank transfers, GST headaches" },
          ].map((row, index) => (
            <motion.div key={index} variants={scaleIn} style={{
              backgroundColor: "rgba(248,247,244,0.05)", padding: "24px", borderRadius: "12px",
              borderLeft: "4px solid #92400e", textAlign: "left",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "24px", fontWeight: 800, color: "#92400e", marginBottom: "8px" }}>{row.cost}</div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "#F8F7F4", marginBottom: "4px" }}>{row.item}</div>
              <div style={{ fontSize: "13px", lineHeight: 1.6, color: "#9ca3af" }}>{row.waste}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p variants={fadeInUp} style={{ fontSize: "16px", color: "#9ca3af", marginBottom: "32px" }}>
          <strong style={{ color: "#F8F7F4" }}>Total waste: ₹2.5L/year</strong> — We charge ₹299/month (₹3,588/year). <strong style={{ color: "#92400e" }}>Save ₹2.46L/year.</strong>
        </motion.p>

        <Link href="/pricing" style={{ textDecoration: "none" }}>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ 
              backgroundColor: "#92400e", color: "#F8F7F4", padding: "16px 36px", 
              borderRadius: "10px", fontSize: "18px", fontWeight: 600, border: "none", 
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px",
            }}
          >
            See Pricing <ChevronRight size={20} />
          </motion.button>
        </Link>
      </motion.section>

      {/* ========== FINAL CTA ========== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ padding: "100px 24px", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}
      >
        <h2 style={{ fontSize: "48px", fontWeight: 700, marginBottom: "16px", color: "#1a1a2e", letterSpacing: "-0.02em" }}>
          Ready to <span style={{ color: "#92400e" }}>Quantify</span> Your Influence?
        </h2>
        <p style={{ fontSize: "18px", lineHeight: 1.6, color: "#4b5563", marginBottom: "32px" }}>
          Join 500+ B2B brands and creators who've quantified their influence. Start your free trial today.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup?role=BRAND" style={{ textDecoration: "none" }}>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ 
                backgroundColor: "#1a1a2e", color: "#F8F7F4", padding: "16px 36px", 
                borderRadius: "10px", fontSize: "18px", fontWeight: 600, border: "none", 
                cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              Start Brand Trial <ChevronRight size={20} />
            </motion.button>
          </Link>
          <Link href="/signup?role=CREATOR" style={{ textDecoration: "none" }}>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ 
                backgroundColor: "#92400e", color: "#F8F7F4", padding: "16px 36px", 
                borderRadius: "10px", fontSize: "18px", fontWeight: 600, border: "none", 
                cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              Create Creator Account <ChevronRight size={20} />
            </motion.button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
