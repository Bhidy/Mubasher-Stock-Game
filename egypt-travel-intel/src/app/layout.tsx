import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Shell from "@/components/Shell";
import GooErrorBoundary from "@/components/GooErrorBoundary";

// Initialize scheduler on server start
import '@/lib/startup';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Atlas Intel",
  description: "Premium analytics dashboard for monitoring Egypt travel agency offers from Instagram. Real-time price tracking, destination trends, and market intelligence.",
  keywords: ["Egypt travel", "travel offers", "analytics", "Instagram", "travel agencies", "Sharm El Sheikh", "Hurghada"],
  authors: [{ name: "Egypt Travel Intel" }],
  openGraph: {
    title: "Egypt Travel Intelligence Platform",
    description: "Monitor Egypt travel offers in real-time",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🇪🇬</text></svg>" />
        <style dangerouslySetInnerHTML={{
          __html: `
          [data-nextjs-toast], [data-nextjs-static-indicator], [data-nextjs-dev-indicator], .nextjs-toast-errors-parent, nextjs-portal {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
        `}} />
      </head>
      <body suppressHydrationWarning className="antialiased min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/20 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        <GooErrorBoundary>
          <Shell>
            {children}
          </Shell>
        </GooErrorBoundary>
      </body>
    </html>
  );
}
