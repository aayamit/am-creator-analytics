import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import AuthProviders from '@/components/providers';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'AM Creator Analytics',
  description: 'Stop measuring vanity metrics. Start tracking real B2B business outcomes with India\'s first full-funnel influencer attribution platform.',
  icons: [
    { url: '/assets/black_AM_fav.png', media: '(prefers-color-scheme: light)' },
    { url: '/assets/white_AM_fav.png', media: '(prefers-color-scheme: dark)' },
  ],
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
