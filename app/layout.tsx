import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import AuthProviders from '@/components/providers';

export const metadata: Metadata = {
  title: 'AM Creator Analytics',
  description: 'Stop measuring vanity metrics. Start tracking real B2B business outcomes with India\'s first full-funnel influencer attribution platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Inter', -apple-system, sans-serif", backgroundColor: '#F8F7F4', color: '#1a1a2e' }}>
        <AuthProviders>
          <NavBar />
          <main style={{ minHeight: 'calc(100vh - 200px)' }}>
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </AuthProviders>
      </body>
    </html>
  );
}
