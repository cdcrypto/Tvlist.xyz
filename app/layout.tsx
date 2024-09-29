import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import { MixNMatchProvider } from '@/contexts/MixNMatchContext';

export const metadata: Metadata = {
  title: "TLX - Tradingview List Xpress",
  description: "Create custom watchlists for cryptocurrency exchanges",
  icons: {
    icon: '/favicon.svg',
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
