'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'About', href: '/about' },
  ];

  return (
    <nav 
      className="sticky top-0 z-50"
      style={{
        backgroundColor: '#F8F7F4',
        borderBottom: '1px solid rgba(26,26,46,0.1)',
        padding: '16px 24px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.05)'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#1a1a2e',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F8F7F4',
              fontWeight: 800,
              fontSize: '14px'
            }}
          >
            AM
          </div>
          <span 
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              color: '#1a1a2e',
              letterSpacing: '-0.02em'
            }}
          >
            AM Creator Analytics
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              style={{
                textDecoration: 'none',
                color: '#4b5563',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'color 0.2s',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/login"
            className="nav-link-ghost"
            style={{
              textDecoration: 'none',
              color: '#1a1a2e',
              fontSize: '14px',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
          >
            Login
          </Link>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button
              className="nav-btn-primary"
              style={{
                backgroundColor: '#1a1a2e',
                color: '#F8F7F4',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                boxShadow: '0 4px 12px rgba(26,26,46,0.2)',
                transition: 'all 0.2s'
              }}
            >
              Start Free Trial
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#1a1a2e'
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden"
          style={{
            marginTop: '16px',
            padding: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: '#4b5563',
                fontSize: '16px',
                fontWeight: 500,
                padding: '12px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '16px 0' }} />
          <Link
            href="/login"
            style={{
              display: 'block',
              textDecoration: 'none',
              color: '#1a1a2e',
              fontSize: '16px',
              fontWeight: 600,
              padding: '12px 16px',
              borderRadius: '8px'
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            style={{ textDecoration: 'none', display: 'block', marginTop: '8px' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <button
              style={{
                width: '100%',
                backgroundColor: '#1a1a2e',
                color: '#F8F7F4',
                padding: '14px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Start Free Trial
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
