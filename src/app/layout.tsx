import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import MainHeader from "./header";
import Footer from "@/components/ui/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://apticode.in'),
  title: {
    default: "AptiCode - AI-Powered Platform for Coding, Aptitude & Competitions",
    template: "%s | AptiCode"
  },
  description: "The ultimate AI-enabled platform for developers to practice coding, compete in challenges, solve aptitude questions, and earn rewards. Master placement prep with our intelligent online compiler.",
  keywords: [
    "apticode", "aptitude test", "coding practice", "online compiler", "placement preparation",
    "ai coding assistant", "competitive programming", "technical interview prep",
    "javascript compiler", "python compiler", "java compiler", "c++ compiler",
    "software engineering", "developer jobs", "coding challenges", "hackathons",
    "data structures", "algorithms", "mobile friendly coding", "online compiler", "online code editor",
    "online python compiler", "online java editor", "online js editor", "online c++ editor", "online c editor",
    "online go compilor"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://apticode.in",
    siteName: "AptiCode",
    title: "AptiCode - AI-Powered Coding & Aptitude Mastery",
    description: "Practice coding on the go with our smart compiler. Ace your placement interviews with comprehensive aptitude tests and AI-driven insights.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AptiCode AI Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AptiCode - Code, Compete, Conquer",
    description: "The ultimate AI-powered platform for developers. Mobile-friendly coding, aptitude mastery, and placement success.",
    creator: "@apticode",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'AptiCode',
    'url': 'https://apticode.in',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://apticode.in/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'AptiCode',
    'applicationCategory': 'EducationalApplication',
    'operatingSystem': 'Web',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  };

  return (
    <html lang="en" data-color-mode="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, softwareAppSchema]) }}
        />
        <MainHeader />
        <main className="min-h-[82vh]">
          {children}
        </main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
