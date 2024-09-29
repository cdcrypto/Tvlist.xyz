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

export const MixNMatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groupedMarkets, setGroupedMarkets] = useState<GroupedMarkets>({});
  const [selectedQuoteAssets, setSelectedQuoteAssets] = useState<Set<string>>(new Set());

  useEffect(() => {
    const cachedMarkets = localStorage.getItem('mixNMatchMarkets');
    const cachedSelectedAssets = localStorage.getItem('mixNMatchSelectedAssets');
    
    if (cachedMarkets) {
      setGroupedMarkets(JSON.parse(cachedMarkets));
    }
    
    if (cachedSelectedAssets) {
      setSelectedQuoteAssets(new Set(JSON.parse(cachedSelectedAssets)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mixNMatchMarkets', JSON.stringify(groupedMarkets));
  }, [groupedMarkets]);

  useEffect(() => {
    localStorage.setItem('mixNMatchSelectedAssets', JSON.stringify(Array.from(selectedQuoteAssets)));
  }, [selectedQuoteAssets]);

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