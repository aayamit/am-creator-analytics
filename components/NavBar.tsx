'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

const navLinks = [
  { label: 'Product', href: '/marketing#modules' },
  { label: 'How It Works', href: '/marketing#workflow' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Creators', href: '/for-creators' },
  { label: 'About', href: '/about' },
];

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const logoSrc =
    resolvedTheme === 'dark' ? '/assets/white_logo.png' : '/assets/black_logo.png';

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b border-border backdrop-blur"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--background) 92%, transparent)',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="/"
          aria-label="AM Creator Analytics home"
          className="flex items-center no-underline hover:no-underline"
        >
          <div className="relative h-9 w-[156px] overflow-hidden sm:h-10 sm:w-[188px] lg:h-11 lg:w-[220px]">
            <Image
              src={logoSrc}
              alt="AM Creator Analytics Logo"
              fill
              priority
              sizes="(max-width: 640px) 156px, (max-width: 1024px) 188px, 220px"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-sm font-medium text-muted-foreground no-underline transition hover:no-underline"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="nav-link-ghost rounded-lg px-4 py-2 text-sm font-semibold text-foreground no-underline transition hover:no-underline"
          >
            Login
          </Link>
          <Link
            href="/contact"
            className="nav-btn-primary rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground no-underline shadow-sm transition hover:no-underline"
          >
            Book a Demo
          </Link>
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground"
          >
            {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground"
          >
            {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-base font-medium text-foreground no-underline transition hover:bg-muted hover:no-underline"
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 border-t border-border" />

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-base font-semibold text-foreground no-underline transition hover:bg-muted hover:no-underline"
            >
              Login
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1 rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground no-underline shadow-sm transition hover:no-underline"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
