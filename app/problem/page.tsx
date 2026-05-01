/**
 * Problem Page — "Cost of Inaction" Focus
 * Bloomberg × McKinsey Design
 * Focus: Agitate pain, show the cost of doing nothing
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, FileText, BarChart3, AlertTriangle, XCircle, Target, 
  ChevronRight, DollarSign, Clock, Users, Shield, ArrowRight
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

const problems = [
  {
    icon: BarChart3,
    stat: "9-12",
    statLabel: "Stakeholders in B2B Buying Committee",
    title: "Vanity Metrics Fail B2B",
    description: "Relying on vanity metrics fails to address complex buying committees of 9 to 12 stakeholders. Likes don't sign contracts, and impressions don't close deals.",
    proof: "90% of B2B campaigns fail because they measure downloads rather than actual business metrics.",
    cost: "$1,200 CAC → $1,800 CAC (50% increase)",
    color: "#92400e",
  },
  {
    icon: FileText,
    stat: "48hrs",
    statLabel: "Media kit data goes stale",
    title: "Static PDFs are Dead",
    description: "Static PDF media kits cause data obsolescence the moment you export them. Creators change their rates, followers, and engagement daily — your PDF is outdated on arrival.",
    proof: "68% of brands report media kit data was stale within 48 hours of receipt.",
    cost: "30+ hours/month on manual verification",
    color: "#1a1a2e",
  },
  {
    icon: TrendingUp,
    stat: "90%",
    statLabel: "Campaigns fail measuring downloads vs. business metrics",
    title: "The Attribution Black Hole",
    description: "90% of B2B campaigns fail because they measure downloads rather than actual business metrics. We track full-funnel attribution — from the first impression to closed-won revenue.",
    proof: "Average B2B SaaS CAC has hit $1,200, and sales cycles average 134 days. We are the antidote.",
    cost: "134 days → 200+ days (lost attribution)",
    color: "#92400e",
  },
];

const costOfInaction = [
  { metric: "$1,200 → $1,800", label: "CAC Inflation", desc: "Without proper attribution, you overpay for low-quality leads", icon: DollarSign },
  { metric: "134 → 200+ days", label: "Sales Cycle Bloat", desc: "Vanity metrics extend sales cycles by 49% on average", icon: Clock },
  { metric: "90% → 95%", label: "Campaign Failure Rate", desc: "Status quo leads to 5% more campaigns failing", icon: XCircle },
  { metric: "0 → $250 Cr", label: "DPDP Fines Risk", desc: "Non-compliant data handling risks India's max penalty", icon: Shield },
];

const failureFlow = [
  { step: "1", title: "Vanity Metric Reported", desc: "Agency reports 1M impressions, 50K likes", icon: TrendingUp },
  { step: "2", title: "Budget Allocated", desc: "₹5L allocated based on vanity metrics", icon: DollarSign },
  { step: "3", title: "Campaign Launched", desc: "No attribution tracking in place", icon: Target },
  { step: "4", title: "Leads Arrive (Low Quality)", desc: "0.9% engagement, no buying intent", icon: Users },
  { step: "5", title: "Sales Cycle Stalls", desc: "134 days pass, no closed-won revenue", icon: Clock },
  { step: "6", title: "Post-Mortem Reveals Truth", desc: "Full-funnel tracking shows $0 ROI", icon: BarChart3 },
];

export default function ProblemPage() {
  return (
    <div style={{ backgroundColor: "#F8F7F4", color: "#1a1a2e", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      
      {/* ========== HERO ========== */}
      <motion.section
        initial="hidden" animate="visible" variants={fadeInUp}
        style={{ backgroundColor: "#1a1a2e", color: "#F8F7F4", padding: "140px 24px 100px", textAlign: "center" }}
      >
        <motion.h1 variants={fadeInUp} style={{ fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "20px" }}>
          The <span style={{ color: "#92400e" }}>Vanity Metric Trap</span>
        </motion.h1>
        <motion.p variants={fadeInUp} style={{ fontSize: "20px", lineHeight: 1.6, maxWidth: "700px", margin: "0 auto 40px", color: "#9ca3af" }}>
          Generic SaaS metrics don't close B2B deals. Here's why traditional influencer marketing is draining your P&L.
        </motion.p>
        <motion.div variants={fadeInUp} style={{ 
          fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", 
          backgroundColor: "rgba(248,247,244,0.05)", padding: "12px 24px", 
          borderRadius: "8px", display: "inline-flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" 
        }}>
          <span><span style={{ color: "#9ca3af" }}>B2B SaaS CAC:</span> <span style={{ color: "#F8F7F4", fontWeight: 700 }}>$1,200</span></span>
          <span style={{ color: "#9ca3af" }}>|</span>
          <span><span style={{ color: "#9ca3af" }}>Sales Cycle:</span> <span style={{ color: "#F8F7F4", fontWeight: 700 }}>134 days</span></span>
          <span style={{ color: "#9ca3af" }}>|</span>
          <span><span style={{ color: "#9ca3af" }}>Fail Rate:</span> <span style={{ color: "#92400e", fontWeight: 700 }}>90%</span></span>
        </motion.div>
      </motion.section>

      {/* ========== PROBLEM PILLARS ========== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={staggerContainer}
        style={{ padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <motion.div variants={staggerContainer} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
          {problems.map((problem, index) => (
            <motion.div
              key={index} variants={scaleIn}
              style={{
                backgroundColor: "#ffffff", padding: "40px 32px", borderRadius: "16px",
                borderLeft: `4px solid ${problem.color}`, boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <problem.icon size={36} color={problem.color} />
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "42px", fontWeight: 800, color: problem.color, lineHeight: 1 }}>{problem.stat}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>{problem.statLabel}</div>
                </div>
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px", color: "#1a1a2e" }}>{problem.title}</h2>
              <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#4b5563", marginBottom: "20px" }}>{problem.description}</p>
              <div style={{ backgroundColor: "#F8F7F4", padding: "16px", borderRadius: "8px", borderLeft: "3px solid #92400e", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#4b5563", margin: 0 }}>{problem.proof}</p>
              </div>
              <div style={{ backgroundColor: "rgba(146,64,14,0.05)", padding: "12px 16px", borderRadius: "8px", borderLeft: "3px solid #92400e" }}>
                <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#92400e", margin: 0, fontWeight: 600 }}>Cost: {problem.cost}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ========== FAILURE FLOW ========== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ backgroundColor: "#1a1a2e", color: "#F8F7F4", padding: "100px 24px" }}
      >
        <motion.h2 variants={fadeInUp} style={{ fontSize: "48px", fontWeight: 700, textAlign: "center", marginBottom: "16px", letterSpacing: "-0.02em" }}>
          The <span style={{ color: "#92400e" }}>Failure</span> Cascade
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ fontSize: "18px", lineHeight: 1.6, textAlign: "center", maxWidth: "600px", margin: "0 auto 60px", color: "#9ca3af" }}>
          Here's exactly how vanity metrics drain your budget, step by step.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          style={{ 
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px",
            maxWidth: "1400px", margin: "0 auto",
          }}
        >
          {failureFlow.map((step, index) => (
            <motion.div
              key={step.step} variants={scaleIn}
              style={{
                backgroundColor: "rgba(248,247,244,0.05)", padding: "32px 24px", borderRadius: "16px",
                borderLeft: "4px solid #92400e", position: "relative",
              }}
            >
              <div style={{
                position: "absolute", top: "16px", right: "16px",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "32px", fontWeight: 800,
                color: "#92400e", opacity: 0.3,
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

      {/* ========== COST OF INACTION ========== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <motion.h2 variants={fadeInUp} style={{ fontSize: "48px", fontWeight: 700, textAlign: "center", marginBottom: "16px", letterSpacing: "-0.02em" }}>
          The <span style={{ color: "#92400e" }}>Cost</span> of Inaction
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ fontSize: "18px", lineHeight: 1.6, textAlign: "center", maxWidth: "600px", margin: "0 auto 60px", color: "#4b5563" }}>
          Doing nothing isn't free. Here's what status quo costs your business.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}
        >
          {costOfInaction.map((item, index) => (
            <motion.div
              key={index} variants={scaleIn}
              style={{
                backgroundColor: "#ffffff", padding: "40px 32px", borderRadius: "16px",
                borderLeft: `4px solid ${index % 2 === 0 ? "#92400e" : "#1a1a2e"}`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <item.icon 
                size={28} 
                color={index % 2 === 0 ? "#92400e" : "#1a1a2e"} 
                style={{ marginBottom: "16px" }} 
              />
              <div style={{ 
                fontFamily: "'JetBrains Mono', monospace", fontSize: "28px", fontWeight: 800, 
                color: index % 2 === 0 ? "#92400e" : "#1a1a2e", marginBottom: "8px",
              }}>
                {item.metric}
              </div>
              <div style={{ fontSize: "18px", fontWeight: 600, color: "#1a1a2e", marginBottom: "12px" }}>
                {item.label}
              </div>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#4b5563", margin: 0 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ========== STRATEGIC CONTEXT ========== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ backgroundColor: "#1a1a2e", color: "#F8F7F4", padding: "80px 24px", textAlign: "center" }}
      >
        <motion.h2 variants={fadeInUp} style={{ fontSize: "40px", fontWeight: 700, marginBottom: "20px", letterSpacing: "-0.02em" }}>
          The <span style={{ color: "#92400e" }}>Antidote</span> Exists
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ fontSize: "18px", lineHeight: 1.6, maxWidth: "700px", margin: "0 auto 40px", color: "#9ca3af" }}>
          We track full-funnel attribution. From the first impression to closed-won revenue. No more vanity metrics, no more PDF delays, no more attribution black holes.
        </motion.p>
        <motion.div variants={fadeInUp} style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ backgroundColor: "rgba(248,247,244,0.05)", padding: "20px 32px", borderRadius: "12px", minWidth: "200px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "36px", fontWeight: 800, color: "#F8F7F4" }}>$8.20</div>
            <div style={{ fontSize: "14px", color: "#9ca3af" }}>ROI per dollar (top tech verticals)</div>
          </div>
          <div style={{ backgroundColor: "rgba(248,247,244,0.05)", padding: "20px 32px", borderRadius: "12px", minWidth: "200px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "36px", fontWeight: 800, color: "#F8F7F4" }}>58%</div>
            <div style={{ fontSize: "14px", color: "#9ca3af" }}>Sales cycle reduction</div>
          </div>
          <div style={{ backgroundColor: "rgba(248,247,244,0.05)", padding: "20px 32px", borderRadius: "12px", minWidth: "200px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "36px", fontWeight: 800, color: "#F8F7F4" }}>$4.1B</div>
            <div style={{ fontSize: "14px", color: "#9ca3af" }}>B2B influencer market size</div>
          </div>
        </motion.div>
      </motion.section>

      {/* ========== CTA ========== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ padding: "100px 24px", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}
      >
        <h2 style={{ fontSize: "40px", fontWeight: 700, marginBottom: "16px", color: "#1a1a2e", letterSpacing: "-0.02em" }}>
          Ready to <span style={{ color: "#92400e" }}>quantify</span> your influence?
        </h2>
        <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#4b5563", marginBottom: "32px" }}>
          Join the B2B influencer revolution. Influence, Quantified. Pipeline, Verified.
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
              I am a Brand (Find ROI) <ChevronRight size={20} />
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
              I am a Creator (Prove Value) <ChevronRight size={20} />
            </motion.button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
