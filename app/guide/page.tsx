'use client'

import React from 'react';
import { useTheme } from 'next-themes';
import Header from '@/components/Header';

export default function GuidePage() {
  const { theme } = useTheme();

  const isDarkMode = theme === 'dark';
  const bgColor = isDarkMode ? 'bg-ftx-dark-blue' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-ftx-dark-blue';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      <Header resetToHome={() => {}} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-ftx-teal">TLX: Your Ultimate Guide to TradingView List Xpress</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What is TLX?</h2>
          <p className="mb-4">TLX, short for TradingView List Xpress, is an indispensable tool for cryptocurrency traders and analysts. Designed to enhance your trading experience, TLX allows you to create customized watchlists tailored to various cryptocurrency exchanges. Whether you&apos;re dealing with spot markets or futures, TLX simplifies the process of tracking and analyzing multiple assets across different platforms, making your trading workflow more efficient and streamlined.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Use TLX</h2>
          <p className="mb-2">Getting started with TLX is straightforward. Follow these simple steps to set up your personalized watchlist:</p>
          <ol className="list-decimal list-inside space-y-2 pl-4">
            <li>Select an Exchange: Begin by choosing your preferred cryptocurrency exchange from the TLX dashboard.</li>
            <li>Choose Market Type: Decide whether you want to focus on spot markets or futures.</li>
            <li>Select Quote Assets: Pick the quote assets you wish to include in your watchlist.</li>
            <li>Download Watchlist: Once your selections are made, download your custom watchlist.</li>
            <li>Import to TradingView: Import the downloaded watchlist into TradingView for advanced charting and in-depth analysis.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Mix and Match Mode</h2>
          <p className="mb-4">One of TLX&apos;s standout features is the Mix and Match Mode. This advanced functionality allows you to create diverse watchlists by combining assets from multiple exchanges. It&apos;s perfect for traders who want to compare assets across different platforms or diversify their watchlists to include a broader range of cryptocurrencies.</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">How to Use Mix and Match Mode:</h3>
          <ol className="list-decimal list-inside space-y-2 pl-4">
            <li>Enable the Feature: Toggle the Mix and Match Mode switch on the TLX dashboard.</li>
            <li>Select Assets: Choose assets from various exchanges and market types (spot or futures).</li>
            <li>Download Watchlist: Download your customized multi-exchange watchlist.</li>
            <li>Integrate with TradingView: Import your comprehensive watchlist into TradingView for enhanced analysis.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Benefits of Using TLX</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Time-Saving: Quickly create custom watchlists for multiple exchanges without the hassle of manual tracking.</li>
            <li>Organization: Maintain organized lists tailored to different trading strategies or specific asset classes.</li>
            <li>Comparative Analysis: Easily compare assets across various exchanges using Mix and Match Mode.</li>
            <li>Enhanced Efficiency: Focus on the assets that matter most to your trading strategy, improving overall trading efficiency.</li>
            <li>TradingView Integration: Seamlessly integrate with TradingView for advanced technical analysis and charting capabilities.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Get Started with TLX Today</h2>
          <p className="mb-4">Whether you&apos;re a day trader, swing trader, or long-term investor, TLX is designed to keep you ahead in the fast-paced cryptocurrency markets. Start creating your custom watchlists today and elevate your trading game to the next level!</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Choose TLX?</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>User-Friendly Interface: Intuitive design makes it easy for traders of all levels to navigate and utilize.</li>
            <li>Comprehensive Support: Access to a range of resources and customer support to help you maximize TLX&apos;s potential.</li>
            <li>Regular Updates: Continuous improvements and updates ensure TLX remains aligned with the latest market trends and trading tools.</li>
          </ul>
          <p className="mt-4 font-semibold">Ready to enhance your crypto trading experience? <a href="/" className="text-ftx-teal hover:underline">Get Started with TLX Now</a> and take control of your cryptocurrency watchlists with ease and precision.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">1. Is TLX compatible with all cryptocurrency exchanges?</h3>
              <p>TLX supports a wide range of popular cryptocurrency exchanges, enabling you to create watchlists across multiple platforms seamlessly.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">2. Can I customize my watchlists based on my trading strategy?</h3>
              <p>Absolutely! TLX allows you to tailor your watchlists to fit various trading strategies, whether you&apos;re focusing on short-term trades or long-term investments.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">3. How does TLX integrate with TradingView?</h3>
              <p>Once you download your custom watchlist from TLX, you can easily import it into TradingView, allowing you to utilize TradingView&apos;s powerful charting and analysis tools.</p>
            </div>
          </div>
        </section>

        <p className="text-xl font-semibold text-ftx-teal">Boost your trading efficiency and stay organized with TLX – the ultimate tool for cryptocurrency traders looking to optimize their watchlists and maximize their market insights.</p>
      </div>
    </div>
  );
}