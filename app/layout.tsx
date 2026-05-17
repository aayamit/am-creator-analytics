import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import AuthProviders from '@/components/providers';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'AM Creator Analytics',
  description:
    "India's operating system for performance-led creator campaigns. Run creator discovery, campaign CRM, contracts, attribution, payouts, and UGC rights from one platform.",
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/assets/black_AM_mark.png', media: '(prefers-color-scheme: light)', type: 'image/png' },
      { url: '/assets/white_AM_mark.png', media: '(prefers-color-scheme: dark)', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProviders>
            <NavBar />
            <main style={{ minHeight: 'calc(100vh - 200px)' }}>
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </AuthProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
