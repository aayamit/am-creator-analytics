import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/seo/json-ld";
import Providers from "./providers";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "AM Creator Analytics | Premium Creator Data Platform",
    template: "%s | AM Creator Analytics",
  },
  description:
    "Move beyond vanity metrics. Premium data-driven insights for brands and creators. Real-time analytics, authentic partnerships, measurable ROI.",
  keywords: [
    "creator analytics",
    "influencer marketing",
    "campaign ROI",
    "social media analytics",
    "creator economy",
    "brand partnerships",
    "audience demographics",
    "media kit generator",
    "YouTube analytics",
    "LinkedIn creator tools",
    "fake follower detection",
    "engagement rate calculator",
    "creator discovery platform",
    "SaaS creator tools",
  ],
  authors: [{ name: "AM Creator Analytics" }],
  creator: "AM Creator Analytics",
  publisher: "AM Creator Analytics",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://amcreatoranalytics.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AM Creator Analytics | Premium Creator Data Platform",
    description:
      "Move beyond vanity metrics. Premium data-driven insights for brands and creators. Real-time analytics, authentic partnerships, measurable ROI.",
    url: "https://amcreatoranalytics.com",
    siteName: "AM Creator Analytics",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AM Creator Analytics - Premium Creator Data Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AM Creator Analytics | Premium Creator Data Platform",
    description:
      "Move beyond vanity metrics. Premium data-driven insights for brands and creators.",
    images: ["/twitter-image.jpg"],
    creator: "@amcreator",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AM Creator Analytics",
    url: "https://amcreatoranalytics.com",
    logo: "https://amcreatoranalytics.com/logo.png",
    description:
      "Premium creator data platform for brands and creators. Move beyond vanity metrics with real-time analytics.",
    sameAs: [
      "https://twitter.com/amcreator",
      "https://linkedin.com/company/am-creator-analytics",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hello@amcreatoranalytics.com",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AM Creator Analytics",
    url: "https://amcreatoranalytics.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://amcreatoranalytics.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
