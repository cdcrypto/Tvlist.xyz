'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

type Market = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  exchange: string;
  type: 'spot' | 'futures';
};

type GroupedMarkets = {
  [key: string]: {
    spot: {
      [quoteAsset: string]: Market[];
    };
    futures: {
      [quoteAsset: string]: Market[];
    };
  };
};

type MixNMatchContextType = {
  groupedMarkets: GroupedMarkets;
  setGroupedMarkets: React.Dispatch<React.SetStateAction<GroupedMarkets>>;
  selectedQuoteAssets: Set<string>;
  setSelectedQuoteAssets: React.Dispatch<React.SetStateAction<Set<string>>>;
};

const MixNMatchContext = createContext<MixNMatchContextType | undefined>(undefined);

// Helper function to check if code is running in browser
const isBrowser = () => typeof window !== 'undefined';

export const MixNMatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groupedMarkets, setGroupedMarkets] = useState<GroupedMarkets>({});
  const [selectedQuoteAssets, setSelectedQuoteAssets] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only access sessionStorage on the client side
    if (isBrowser()) {
      const cachedMarkets = sessionStorage.getItem('mixNMatchMarkets');
      const cachedSelectedAssets = sessionStorage.getItem('mixNMatchSelectedAssets');
      
      if (cachedMarkets) {
        setGroupedMarkets(JSON.parse(cachedMarkets));
      }
      
      if (cachedSelectedAssets) {
        setSelectedQuoteAssets(new Set(JSON.parse(cachedSelectedAssets)));
      }
    }
  }, [isClient]); // Only run when component mounts on client

  useEffect(() => {
    // Only save to sessionStorage on the client side
    if (isBrowser() && isClient) {
      sessionStorage.setItem('mixNMatchMarkets', JSON.stringify(groupedMarkets));
    }
  }, [groupedMarkets, isClient]);

  useEffect(() => {
    // Only save to sessionStorage on the client side
    if (isBrowser() && isClient) {
      sessionStorage.setItem('mixNMatchSelectedAssets', JSON.stringify(Array.from(selectedQuoteAssets)));
    }
  }, [selectedQuoteAssets, isClient]);

  return (
    <MixNMatchContext.Provider value={{ groupedMarkets, setGroupedMarkets, selectedQuoteAssets, setSelectedQuoteAssets }}>
      {children}
    </MixNMatchContext.Provider>
  );
};

export const useMixNMatchContext = () => {
  const context = useContext(MixNMatchContext);
  if (context === undefined) {
    throw new Error('useMixNMatchContext must be used within a MixNMatchProvider');
  }
  return context;
};