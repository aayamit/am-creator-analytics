'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const logoSrc = theme === 'dark' ? '/assets/white_logo.png' : '/assets/black_logo.png';

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
        backgroundColor: 'var(--background)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 24px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.05)'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 160, height: 40, position: 'relative' }}>
            <Image
              src={logoSrc}
              alt="AM Creator Analytics Logo"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
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
              color: 'var(--foreground)',
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
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
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
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: 'var(--foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
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
            color: 'var(--foreground)'
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
            backgroundColor: 'var(--background)',
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
                color: 'var(--muted-foreground)',
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
          <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '16px 0' }} />
          <Link
            href="/login"
            style={{
              display: 'block',
              textDecoration: 'none',
              color: 'var(--foreground)',
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
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
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
