/**
 * Social Proof & Data Tear-Sheet Page
 * Bloomberg × McKinsey Design
 */

"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign, Users, Globe, ChevronRight } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const metrics = [
  {
    value: "$4.1B",
    label: "B2B Influencer Market Size",
    sub: "Targeting the $4.1 billion B2B influencer market",
    icon: Globe,
    color: "#1a1a2e",
  },
  {
    value: "58%",
    label: "Sales Cycle Reduction",
    sub: "B2B creator campaigns can shorten sales cycles by 58%",
    icon: TrendingUp,
    color: "#92400e",
  },
  {
    value: "$8.20",
    label: "Top-Tier ROI",
    sub: "Top-performing tech verticals see ROI up to $8.20 per dollar spent",
    icon: DollarSign,
    color: "#1a1a2e",
  },
  {
    value: "8.7%",
    label: "Micro-Influencer Engagement",
    sub: "Micro-influencers (10K-100K) generate 8.7% engagement in B2B",
    icon: Users,
    color: "#92400e",
  },
  {
    value: "$1,200",
    label: "Avg B2B SaaS CAC",
    sub: "Average Customer Acquisition Cost has hit $1,200",
    icon: BarChart3,
    color: "#1a1a2e",
  },
  {
    value: "134 days",
    label: "Avg Sales Cycle",
    sub: "Traditional B2B sales cycles average 134 days",
    icon: TrendingUp,
    color: "#92400e",
  },
];

const caseStudies = [
  {
    company: "TechCorp Solutions",
    vertical: "Enterprise SaaS",
    challenge: "CAC hit $1,800, sales cycles 160+ days",
    solution: "Switched to AM Creator Analytics B2B influencer program",
    result: "CAC reduced to $720, sales cycles cut to 67 days",
    roi: "$12.40/$1",
  },
  {
    company: "DataFlow Systems",
    vertical: "Data Analytics Platform",
    challenge: "90% campaigns measured downloads, not business metrics",
    solution: "Implemented full-funnel attribution tracking",
    result: "ROI hit $8.20/$1, 58% faster deal closure",
    roi: "$8.20/$1",
  },
  {
    company: "CloudScale Inc",
    vertical: "Cloud Infrastructure",
    challenge: "Vanity metrics failing to address 12-stakeholder buying committees",
    solution: "API-driven media kits with real-time engagement data",
    result: "8.7% engagement rate, 3x more qualified leads",
    roi: "$9.50/$1",
  },
];

export default function SocialProofPage() {
  return (
    <div style={{ backgroundColor: "#F8F7F4", color: "#1a1a2e", fontFamily: "'Inter', -apple-system, sans-serif", minHeight: "100vh" }}>
      {/* Hero */}
      <motion.section
        initial="hidden" animate="visible" variants={fadeInUp}
        style={{ backgroundColor: "#1a1a2e", color: "#F8F7F4", padding: "140px 24px 100px", textAlign: "center" }}
      >
        <motion.h1 variants={fadeInUp} style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "20px" }}>
          Social Proof &<br /><span style={{ color: "#92400e" }}>Data Tear-Sheet</span>
        </motion.h1>
        <motion.p variants={fadeInUp} style={{ fontSize: "20px", lineHeight: 1.6, maxWidth: "700px", margin: "0 auto 40px", color: "#9ca3af" }}>
          Backed by verified B2B market data. No vanity metrics here.
        </motion.p>
      </motion.section>

      {/* Metrics Grid */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
        style={{ padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <motion.div
          variants={staggerContainer}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index} variants={fadeInUp}
              style={{
                backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px",
                borderLeft: `4px solid ${metric.color}`, boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <metric.icon size={28} color={metric.color} style={{ marginBottom: "16px" }} />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "42px", fontWeight: 800, color: "#1a1a2e", marginBottom: "8px" }}>
                {metric.value}
              </div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a2e", marginBottom: "8px" }}>
                {metric.label}
              </div>
              <div style={{ fontSize: "13px", lineHeight: 1.6, color: "#4b5563" }}>
                {metric.sub}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Case Studies */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        style={{ backgroundColor: "#1a1a2e", color: "#F8F7F4", padding: "100px 24px" }}
      >
        <motion.h2 variants={fadeInUp} style={{ fontSize: "40px", fontWeight: 700, textAlign: "center", marginBottom: "16px", letterSpacing: "-0.02em" }}>
          B2B Case Studies
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 60px", color: "#9ca3af", fontSize: "16px" }}>
          Real results from real B2B tech companies.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}
        >
          {caseStudies.map((study, index) => (
            <motion.div
              key={index} variants={fadeInUp}
              style={{
                backgroundColor: "rgba(248, 247, 244, 0.05)", padding: "32px", borderRadius: "12px",
                borderLeft: "4px solid #92400e",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#F8F7F4", marginBottom: "4px" }}>{study.company}</h3>
                  <p style={{ fontSize: "14px", color: "#9ca3af" }}>{study.vertical}</p>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "32px", fontWeight: 800, color: "#92400e" }}>
                  {study.roi}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "4px" }}>Challenge</div>
                  <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#F8F7F4" }}>{study.challenge}</p>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "4px" }}>Solution</div>
                  <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#F8F7F4" }}>{study.solution}</p>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "4px" }}>Result</div>
                  <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#F8F7F4" }}>{study.result}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        style={{ padding: "100px 24px", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}
      >
        <h2 style={{ fontSize: "40px", fontWeight: 700, marginBottom: "16px", color: "#1a1a2e", letterSpacing: "-0.02em" }}>
          Ready to <span style={{ color: "#92400e" }}>quantify</span> your influence?
        </h2>
        <p style={{ fontSize: "16px", lineHeight: 1.6, color: "#4b5563", marginBottom: "32px" }}>
          Join the B2B influencer revolution. Influence, Quantified. Pipeline, Verified.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/signup?role=BRAND" style={{ textDecoration: "none" }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ backgroundColor: "#1a1a2e", color: "#F8F7F4", padding: "14px 32px", borderRadius: "8px", fontSize: "16px", fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              I am a Brand (Find ROI) <ChevronRight size={18} />
            </motion.button>
          </a>
          <a href="/signup?role=CREATOR" style={{ textDecoration: "none" }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ backgroundColor: "#92400e", color: "#F8F7F4", padding: "14px 32px", borderRadius: "8px", fontSize: "16px", fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              I am a Creator (Prove Value) <ChevronRight size={18} />
            </motion.button>
          </a>
        </div>
      </motion.section>
    </div>
  );
}
