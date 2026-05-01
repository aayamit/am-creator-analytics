'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer 
      className="site-footer"
      style={{
        backgroundColor: '#1a1a2e',
        color: '#F8F7F4',
        padding: '60px 24px 40px',
        marginTop: 'auto'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#92400e',
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
              <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em' }}>
                AM Creator Analytics
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#9ca3af', margin: 0 }}>
              India's first full-funnel B2B influencer attribution platform. Stop measuring vanity metrics.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#F8F7F4', marginBottom: '16px' }}>
              Product
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Features', href: '/features' },
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Case Studies', href: '/case-studies' },
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: '12px' }}>
                  <Link
                    href={link.href}
                    className="footer-link"
                    style={{
                      textDecoration: 'none',
                      color: '#9ca3af',
                      fontSize: '14px',
                      transition: 'color 0.2s'
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#F8F7F4', marginBottom: '16px' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
                { label: 'Careers', href: '/careers' },
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: '12px' }}>
                  <Link
                    href={link.href}
                    className="footer-link"
                    style={{
                      textDecoration: 'none',
                      color: '#9ca3af',
                      fontSize: '14px',
                      transition: 'color 0.2s'
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#F8F7F4', marginBottom: '16px' }}>
              Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cookie Policy', href: '/cookies' },
                { label: 'DPDP Compliance', href: '/dpdp' },
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: '12px' }}>
                  <Link
                    href={link.href}
                    className="footer-link"
                    style={{
                      textDecoration: 'none',
                      color: '#9ca3af',
                      fontSize: '14px',
                      transition: 'color 0.2s'
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          style={{
            borderTop: '1px solid rgba(248,247,244,0.1)',
            paddingTop: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            © 2024 AM Creator Analytics. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
              <Link
                key={social}
                href="#"
                className="footer-link"
                style={{
                  textDecoration: 'none',
                  color: '#9ca3af',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }}
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
