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
    default: "AptiCode - Platform for Coding, Aptitude & Competitions",
    template: "%s | AptiCode"
  },
  description: "The ultimate platform for developers to practice coding, compete in challenges, solve aptitude questions, and earn rewards. Mobile-friendly coding environment.",
  keywords: ["aptitude", "coding", "test", "problems", "quiz", "online compiler", "mobile friendly", "responsive", "developer", "competition", "programming", "javascript", "python", "go", "java", "cpp", "code compiler", "python compiler", "java compiler", "c compiler", "cpp compiler"],
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
    title: "AptiCode - Learn, Compete, Grow",
    description: "Practice coding on the go with our mobile-friendly compiler. Join challenges and improve your skills.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AptiCode Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AptiCode",
    description: "The ultimate platform for developers. Mobile-friendly coding and aptitude tests.",
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
    '@type': 'Organization',
    'name': 'AptiCode',
    'url': 'https://apticode.in',
    'logo': 'https://apticode.in/logo.png', // Assuming logo exists
    'sameAs': [
      'https://twitter.com/apticode',
      'https://github.com/apticode'
    ]
  }

  return (
    <html lang="en" data-color-mode="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
