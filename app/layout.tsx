import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import { MixNMatchProvider } from '@/contexts/MixNMatchContext';

export const metadata: Metadata = {
  title: "TLX - Tradingview List Xpress",
  description: "Create custom watchlists for cryptocurrency exchanges",
  openGraph: {
    title: "TLX - Tradingview List Xpress",
    description: "Create custom watchlists for cryptocurrency exchanges",
    siteName: "Tradingview List Xpress",
    images: [
      {
        url: '/components/Social.png', // Updated path
        width: 1200,
        height: 630,
        alt: 'TLX - Tradingview List Xpress',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "TLX - Tradingview List Xpress",
    description: "Create custom watchlists for cryptocurrency exchanges",
    images: ['/components/Social.png'], // Updated path
  },
  icons: {
    icon: '/app/favicon.svg', // Updated path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MixNMatchProvider>
          <Providers>{children}</Providers>
        </MixNMatchProvider>
      </body>
    </html>
  );
}
