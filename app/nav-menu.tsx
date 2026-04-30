"use client";

/**
 * Navigation Menu - Client Component
 * Handles mobile menu toggle, interactive elements
 */

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function NavMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav style={{
      backgroundColor: '#1a1a2e',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{ fontSize: '24px', fontWeight: 700, color: '#F8F7F4', letterSpacing: '-0.02em' }}>
        AM Creator
      </div>

      {/* Desktop Nav */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }} className="desktop-nav">
        <Link href="#features" style={{ color: '#F8F7F4', textDecoration: 'none', fontSize: '14px' }}>Features</Link>
        <Link href="#pricing" style={{ color: '#F8F7F4', textDecoration: 'none', fontSize: '14px' }}>Pricing</Link>
        <Link href="#testimonials" style={{ color: '#F8F7F4', textDecoration: 'none', fontSize: '14px' }}>Testimonials</Link>
        <Link href="/login">
          <Button variant="outline" style={{ borderColor: '#F8F7F4', color: '#F8F7F4' }}>Login</Button>
        </Link>
        <Link href="/signup">
          <Button style={{ backgroundColor: '#92400e', color: '#F8F7F4' }}>Sign Up Free</Button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{ display: 'none', background: 'none', border: 'none', color: '#F8F7F4', cursor: 'pointer' }}
        className="mobile-menu-btn"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </nav>
  );
}
