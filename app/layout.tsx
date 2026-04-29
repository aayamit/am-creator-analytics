import { Metadata } from 'next';
import type { Viewport } from 'next';

export const metadata: Metadata = {
  title: 'AM Creator Analytics',
  description: 'Enterprise multi-tenant creator analytics platform',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F8F7F4',
};

/**
 * Bloomberg × McKinsey Design System
 * Applied globally via CSS variables
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          backgroundColor: '#F8F7F4',
          color: '#1a1a2e',
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
