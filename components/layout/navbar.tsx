/**
 * NavBar Component — Bloomberg × McKinsey Design
 * Unified navigation for landing page + non-dashboard pages
 * Cream #F8F7F4, Dark Navy #1a1a2e, Accent #92400e
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#problem", label: "Problem" },
    { href: "/#solution", label: "Solution" },
    { href: "/#social-proof", label: "Proof" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "#F8F7F4",
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(248, 247, 244, 0.95)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
          color: "#1a1a2e",
        }}
      >
        <TrendingUp size={24} color="#92400e" />
        <span
          style={{
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          AM Creator
        </span>
      </Link>

      {/* Desktop Nav */}
      <div
        style={{
          display: "flex",
          gap: "32px",
          alignItems: "center",
        }}
        className="desktop-nav"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: "#1a1a2e",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#92400e")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a2e")}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/signup?role=BRAND">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              backgroundColor: "#1a1a2e",
              color: "#F8F7F4",
              padding: "8px 20px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            I am a Brand
          </motion.button>
        </Link>
        <Link href="/signup?role=CREATOR">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              backgroundColor: "#92400e",
              color: "#F8F7F4",
              padding: "8px 20px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            I am a Creator
          </motion.button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          display: "none",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
        }}
        className="mobile-menu-btn"
      >
        {mobileMenuOpen ? <X size={24} color="#1a1a2e" /> : <Menu size={24} color="#1a1a2e" />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "#F8F7F4",
              borderBottom: "1px solid #e5e7eb",
              padding: "16px 32px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: "#1a1a2e",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/signup?role=BRAND" onClick={() => setMobileMenuOpen(false)}>
              <button
                style={{
                  backgroundColor: "#1a1a2e",
                  color: "#F8F7F4",
                  padding: "12px 20px",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                I am a Brand
              </button>
            </Link>
            <Link href="/signup?role=CREATOR" onClick={() => setMobileMenuOpen(false)}>
              <button
                style={{
                  backgroundColor: "#92400e",
                  color: "#F8F7F4",
                  padding: "12px 20px",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                I am a Creator
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </motion.nav>
  );
}
