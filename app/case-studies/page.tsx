/**
 * NEW PAGE: Case Studies — Flows & Benefits
 * Bloomberg × McKinsey Design
 * Detailed case studies with flow diagrams
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  TrendingUp, DollarSign, BarChart3, Users, Shield, ChevronRight, 
  CheckCircle2, Star, ArrowRight, Globe, Clock, Target, FileText
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const caseStudies = [
  {
    company: "TechCorp Solutions",
    vertical: "Enterprise SaaS",
    logo: "TC",
    challenge: "CAC hit $1,800, sales cycles 160+ days, 90% campaigns measured downloads not business metrics",
    solution: "Implemented full-funnel attribution tracking + premium creator search (8.7% engagement filter)",
    flow: [
      { step: "1", title: "Defined ICP", desc: "Filtered by B2B SaaS decision-makers" },
      { step: "2", title: "Found 12 Creators", desc: "8.7% avg engagement, verified authenticity" },
      { step: "3", title: "Launched Campaign", desc: "OpenSign contracts, $50K saved vs DocuSign" },
      { step: "4", title: "Tracked ROI", desc: "Full-funnel: $8.20 per $1 spent" },
    ],
    result: "CAC reduced to $720, sales cycles cut to 67 days",
    roi: "$12.40/$1",
    color: "#1a1a2e",
    savings: "$108,000/year (100 customers × $1,080 savings)",
  },
  {
    company: "DataFlow Systems",
    vertical: "Data Analytics Platform",
    logo: "DF",
    challenge: "68% media kits stale within 48hrs, 30+ hours/month on manual verification, attribution black hole",
    solution: "Live API-driven media kits + automated payouts via Cashfree",
    flow: [
      { step: "1", title: "Connected Platforms", desc: "OAuth YouTube + LinkedIn in 1 click" },
      { step: "2", title: "Built Live Kit", desc: "API-driven, updates daily, no PDF obsolescence" },
      { step: "3", title: "Pitched 5 Brands", desc: "3-step wizard, got 3 responses" },
      { step: "4", title: "Got Paid Fast", desc: "Cashfree payout in 24hrs, GST invoice auto-generated" },
    ],
    result: "ROI hit $8.20/$1, 58% faster deal closure",
    roi: "$8.20/$1",
    color: "#92400e",
    savings: "58% faster deal closure = $25,333/month saved",
  },
  {
    company: "CloudScale Inc",
    vertical: "Cloud Infrastructure",
    logo: "CS",
    challenge: "Vanity metrics failing to address 12-stakeholder buying committees, 0.9% engagement rate",
    solution: "Switched to B2B micro-influencers (10K-100K) with 8.7% engagement",
    flow: [
      { step: "1", title: "Targeted Micro-Influencers", desc: "8.7% vs 0.9% engagement (9.67x better)" },
      { step: "2", title: "Verified Authenticity", desc: "Bot detection algorithms flagged 23% fake followers" },
      { step: "3", title: "Multi-Touch Attribution", desc: "Tracked 9-12 stakeholders per deal" },
      { step: "4", title: "Scaled to 50 Creators", desc: "3x more qualified leads, $9.50/$1 ROI" },
    ],
    result: "3x more qualified leads, ROI $9.50/$1, closed-won revenue up 215%",
    roi: "$9.50/$1",
    color: "#1a1a2e",
    savings: "3x leads = $300K additional pipeline/year",
  },
];

export default function CaseStudiesPage() {
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
          Case <span style={{ color: "#92400e" }}>Studies</span>
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
          Real B2B companies. Real results. <strong style={{ color: "#1a1a2e" }}>See exactly how we deliver ROI.</strong>
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
              Start Brand Trial <ChevronRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>

      {/* ========= CASE STUDIES ========= */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <motion.h2 variants={fadeInUp} style={{ fontSize: "48px", fontWeight: 700, textAlign: "center", marginBottom: "16px", letterSpacing: "-0.02em" }}>
          Proven <span style={{ color: "#92400e" }}>Results</span>
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ fontSize: "18px", lineHeight: 1.6, textAlign: "center", maxWidth: "600px", margin: "0 auto 60px", color: "#4b5563" }}>
          Each case study shows the flow from problem to solution to ROI.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          style={{ display: "flex", flexDirection: "column", gap: "48px" }}
        >
          {caseStudies.map((study, index) => (
            <motion.div
              key={index} variants={fadeInUp}
              style={{
                backgroundColor: "#ffffff",
                padding: "48px 40px",
                borderRadius: "16px",
                borderLeft: `4px solid ${study.color}`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "12px",
                    backgroundColor: study.color, color: "#F8F7F4",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px", fontWeight: 800,
                  }}>
                    {study.logo}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", marginBottom: "4px" }}>{study.company}</h3>
                    <p style={{ fontSize: "14px", color: "#6b7280" }}>{study.vertical}</p>
                  </div>
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "32px", fontWeight: 800,
                  color: "#92400e",
                }}>
                  {study.roi}
                </div>
              </div>

              {/* Challenge & Solution */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "32px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "8px" }}>Challenge</div>
                  <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#4b5563", margin: 0 }}>{study.challenge}</p>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "8px" }}>Solution</div>
                  <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#4b5563", margin: 0 }}>{study.solution}</p>
                </div>
              </div>

              {/* Flow Diagram */}
              <div style={{ marginBottom: "32px" }}>
                <div style={{ fontSize: "12px", color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "16px" }}>Flow</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                  {study.flow.map((step) => (
                    <div key={step.step} style={{
                      backgroundColor: "#F8F7F4", padding: "20px", borderRadius: "12px",
                      borderLeft: `3px solid ${study.color}`,
                    }}>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "24px", fontWeight: 800,
                        color: study.color, marginBottom: "8px",
                      }}>
                        {step.step}
                      </div>
                      <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a2e", marginBottom: "8px" }}>{step.title}</h4>
                      <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#4b5563", margin: 0 }}>{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result & Savings */}
              <div style={{ backgroundColor: "#F8F7F4", padding: "24px", borderRadius: "12px", borderLeft: "3px solid #92400e" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#92400e", marginBottom: "8px" }}>Result</div>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#1a1a2e", marginBottom: "12px" }}>{study.result}</p>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: 600,
                  color: "#92400e",
                }}>
                  {study.savings}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ========= CTA ========= */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ 
          backgroundColor: "#1a1a2e", color: "#F8F7F4", 
          padding: "100px 24px", textAlign: "center",
        }}
      >
        <motion.h2 variants={fadeInUp} style={{ fontSize: "48px", fontWeight: 700, marginBottom: "20px", letterSpacing: "-0.02em" }}>
          Ready to <span style={{ color: "#92400e" }}>Quantify</span> Your Influence?
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ fontSize: "20px", lineHeight: 1.6, maxWidth: "700px", margin: "0 auto 40px", color: "#9ca3af" }}>
          Join these companies. Start your free trial today.
        </motion.p>
        <motion.div variants={fadeInUp} style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup?role=BRAND" style={{ textDecoration: "none" }}>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ 
                backgroundColor: "#F8F7F4", 
                color: "#1a1a2e", 
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
        </motion.div>
      </motion.section>
    </div>
  );
}
