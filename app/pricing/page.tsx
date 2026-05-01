/**
 * Pricing Page — Bloomberg × McKinsey Design
 * Hybrid pricing: Base Subscription + Usage/Outcome Tiers
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ChevronRight, Star } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const pricingTiers = [
  {
    name: "Creator Pro",
    price: "₹29",
    period: "/month",
    description: "For rising creators ready to prove value",
    features: [
      "API-Driven Media Kit",
      "Pitch to Brands (3-step wizard)",
      "₹1,500 Signing Bonus (50K+ followers)",
      "GST-Ready Invoices",
      "Basic Analytics Dashboard",
    ],
    cta: "Prove Value",
    highlight: false,
    savings: null,
  },
  {
    name: "Brand Professional",
    price: "₹299",
    period: "/month",
    description: "For brands running B2B influencer campaigns",
    features: [
      "Premium Creator Search (Filters + Animations)",
      "Full-Funnel CRM Sync (Salesforce/HubSpot)",
      "Contract Management (OpenSign)",
      "AI Authenticity Layer",
      "Pitch Inbox + Management",
      "Advanced ROI Analytics",
    ],
    cta: "Find ROI",
    highlight: true,
    savings: "Save ₹50K/year vs DocuSign",
  },
  {
    name: "Creator Elite",
    price: "₹99",
    period: "/month",
    description: "For top creators commanding premium rates",
    features: [
      "Everything in Pro +",
      "Priority Brand Discovery",
      "Custom Media Kit Design",
      "Dedicated Account Manager",
      "White-Label Reports",
    ],
    cta: "Command Premium",
    highlight: false,
    savings: "8.7% engagement rate",
  },
];

const faqItems = [
  {
    q: "What is the signing bonus?",
    a: "Creators with 50K+ followers get ₹1,500 automatically when they sign their first contract through our platform.",
  },
  {
    q: "Can I switch plans anytime?",
    a: "Yes, you can upgrade or downgrade anytime. Usage-based pricing applies to Brand Professional plan.",
  },
  {
    q: "Is OpenSign really free?",
    a: "Yes! We self-host OpenSign, saving you ₹50K/year compared to DocuSign. No per-document fees.",
  },
  {
    q: "What payment methods do you support?",
    a: "We support UPI, bank transfers, and all major credit cards via Cashfree. GST invoices included.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div style={{ backgroundColor: "#F8F7F4", color: "#1a1a2e", fontFamily: "'Inter', -apple-system, sans-serif", minHeight: "100vh" }}>
      
      {/* Hero */}
      <motion.section
        initial="hidden" animate="visible" variants={fadeInUp}
        style={{ padding: "140px 24px 100px", textAlign: "center", maxWidth: "900px", margin: "0 auto" }}
      >
        <motion.h1 variants={fadeInUp} style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "20px" }}>
          Simple, <span style={{ color: "#92400e" }}>Transparent</span> Pricing
        </motion.h1>
        <motion.p variants={fadeInUp} style={{ fontSize: "20px", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 40px", color: "#4b5563" }}>
          Hybrid model: Base Subscription + Usage/Outcome Tiers. Save ₹32L/year with open-source tools.
        </motion.p>

        {/* Toggle */}
        <motion.div variants={fadeInUp} style={{ display: "flex", alignItems: "center", gap: "16px", justifyContent: "center", marginBottom: "32px" }}>
          <span style={{ fontSize: "14px", color: annual ? "#4b5563" : "#1a1a2e", fontWeight: annual ? 400 : 600 }}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            style={{
              width: "60px", height: "32px", borderRadius: "16px",
              backgroundColor: annual ? "#92400e" : "#e5e7eb",
              border: "none", cursor: "pointer", position: "relative",
              transition: "background-color 0.3s",
            }}
          >
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              backgroundColor: "#ffffff", position: "absolute",
              top: "2px", left: annual ? "30px" : "2px",
              transition: "left 0.3s", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }} />
          </button>
          <span style={{ fontSize: "14px", color: annual ? "#1a1a2e" : "#4b5563", fontWeight: annual ? 600 : 400 }}>
            Annual <span style={{ color: "#92400e", fontSize: "12px" }}>Save 20%</span>
          </span>
        </motion.div>
      </motion.section>

      {/* Pricing Cards */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        style={{ padding: "0 24px 100px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}
        >
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index} variants={scaleIn}
              style={{
                backgroundColor: tier.highlight ? "#1a1a2e" : "#ffffff",
                color: tier.highlight ? "#F8F7F4" : "#1a1a2e",
                padding: "44px 32px", borderRadius: "16px",
                boxShadow: tier.highlight
                  ? "0 20px 60px rgba(26,26,46,0.3)"
                  : "0 4px 16px rgba(0,0,0,0.08)",
                border: tier.highlight ? "2px solid #92400e" : "1px solid #e5e7eb",
                position: "relative", overflow: "hidden",
              }}
            >
              {tier.highlight && (
                <div style={{
                  position: "absolute", top: "16px", right: "-30px",
                  backgroundColor: "#92400e", color: "#F8F7F4",
                  padding: "4px 40px", fontSize: "12px", fontWeight: 600,
                  transform: "rotate(45deg)", display: "flex", alignItems: "center", gap: "4px",
                }}>
                  <Star size={14} /> POPULAR
                </div>
              )}

              <h3 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>{tier.name}</h3>
              <p style={{
                fontSize: "14px", lineHeight: 1.6,
                color: tier.highlight ? "#9ca3af" : "#6b7280",
                marginBottom: "24px",
              }}>
                {tier.description}
              </p>

              <div style={{ marginBottom: "24px" }}>
                <span style={{ fontSize: "48px", fontWeight: 800 }}>
                  {annual ? `₹${Math.round(parseInt(tier.price.replace('₹', '')) * 12 * 0.8)}` : tier.price}
                </span>
                <span style={{ fontSize: "16px", color: tier.highlight ? "#9ca3af" : "#6b7280" }}>
                  {annual ? "/year" : tier.period}
                </span>
              </div>

              {tier.savings && (
                <div style={{
                  backgroundColor: tier.highlight ? "rgba(248,247,244,0.1)" : "#F8F7F4",
                  padding: "8px 12px", borderRadius: "6px", marginBottom: "24px",
                  fontSize: "13px", color: tier.highlight ? "#92400e" : "#92400e",
                  fontWeight: 600,
                }}>
                  {tier.savings}
                </div>
              )}

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", textAlign: "left" }}>
                {tier.features.map((feature, i) => (
                  <li key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: "8px",
                    marginBottom: "12px", fontSize: "14px", lineHeight: 1.6,
                  }}>
                    <CheckCircle size={16} color={tier.highlight ? "#92400e" : "#10b981"} style={{ flexShrink: 0, marginTop: "2px" }} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/signup" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%", padding: "14px", borderRadius: "8px",
                    border: "none", fontSize: "16px", fontWeight: 600,
                    cursor: "pointer",
                    backgroundColor: tier.highlight ? "#92400e" : "#1a1a2e",
                    color: "#F8F7F4",
                  }}
                >
                  {tier.cta} <ChevronRight size={18} />
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        style={{ backgroundColor: "#1a1a2e", color: "#F8F7F4", padding: "100px 24px", textAlign: "center" }}
      >
        <motion.h2 variants={fadeInUp} style={{ fontSize: "40px", fontWeight: 700, marginBottom: "16px", letterSpacing: "-0.02em" }}>
          Frequently Asked <span style={{ color: "#92400e" }}>Questions</span>
        </motion.h2>
        <motion.div variants={fadeInUp} style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
          {faqItems.map((item, index) => (
            <motion.div
              key={index} variants={fadeInUp}
              style={{
                backgroundColor: "rgba(248,247,244,0.05)", padding: "24px",
                borderRadius: "12px", marginBottom: "16px", borderLeft: "4px solid #92400e",
              }}
            >
              <h4 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px", color: "#F8F7F4" }}>{item.q}</h4>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#9ca3af", margin: 0 }}>{item.a}</p>
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
          <Link href="/signup?role=BRAND" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: "#1a1a2e", color: "#F8F7F4",
                padding: "14px 32px", borderRadius: "8px",
                fontSize: "16px", fontWeight: 600, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              I am a Brand (Find ROI) <ChevronRight size={18} />
            </motion.button>
          </Link>
          <Link href="/signup?role=CREATOR" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: "#92400e", color: "#F8F7F4",
                padding: "14px 32px", borderRadius: "8px",
                fontSize: "16px", fontWeight: 600, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              I am a Creator (Prove Value) <ChevronRight size={18} />
            </motion.button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
