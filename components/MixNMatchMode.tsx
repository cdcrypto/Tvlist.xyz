import React, { useState, useEffect } from 'react';
import { fetchAllSpotMarkets as fetchBinanceSpotMarkets, fetchAllFuturesMarkets as fetchBinanceFuturesMarkets } from '@/utils/fetchmarkets';
import { fetchAllSpotMarkets as fetchBybitSpotMarkets, fetchAllFuturesMarkets as fetchBybitFuturesMarkets } from '@/utils/fetchbybit';
import { fetchAllSpotMarkets as fetchBitgetSpotMarkets, fetchAllFuturesMarkets as fetchBitgetFuturesMarkets } from '@/utils/fetchbitget';
import { fetchAllSpotMarkets as fetchKucoinSpotMarkets, fetchAllFuturesMarkets as fetchKucoinFuturesMarkets } from '@/utils/fetchkucoin';
import { fetchAllSpotMarkets as fetchBitfinexSpotMarkets } from '@/utils/fetchbitfinex';
import { fetchAllMarkets as fetchDydxMarkets } from '@/utils/fetchdydx';
import { fetchAllSpotMarkets as fetchOkxSpotMarkets, fetchAllFuturesMarkets as fetchOkxFuturesMarkets } from '@/utils/fetchokx';
import { fetchAllSpotMarkets as fetchMexcSpotMarkets, fetchAllFuturesMarkets as fetchMexcFuturesMarkets } from '@/utils/fetchmexc';
import { fetchAllSpotMarkets as fetchPoloniexSpotMarkets } from '@/utils/fetchpoloniex';
import { fetchAllKrakenSpotMarkets } from '@/utils/fetchkraken';
import { fetchAllSpotMarkets as fetchCryptocomSpotMarkets } from '@/utils/fetchcryptocom';
import { useMixNMatchContext } from '@/contexts/MixNMatchContext';
import { fetchAllMarkets as fetchCoinbaseMarkets } from '@/utils/fetchcoinbase';
import { fetchAllGateSpotMarkets } from '@/utils/fetchgate';
import { fetchAllSpotMarkets as fetchPhemexSpotMarkets, fetchAllFuturesMarkets as fetchPhemexFuturesMarkets } from '@/utils/fetchphemex';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Search, ChevronDown, ChevronRight } from 'lucide-react';
import FakeSupportChat from './FakeSupportChat';
import { DownloadPopup } from './DownloadPopup';

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

interface FetchResult {
  markets: { symbol: string; baseAsset: string; quoteAsset: string }[];
  assetCounts: Record<string, number>;
  quoteAssets: string[];
}

const fetchWithRetry = async (fetchFunction: () => Promise<FetchResult>, retries = 3, delay = 2000): Promise<FetchResult> => {
  try {
    return await fetchFunction();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(fetchFunction, retries - 1, delay);
    }
    throw error;
  }
};

export function MixNMatchMode({ isDarkMode }: { isDarkMode: boolean }) {
  const { groupedMarkets, setGroupedMarkets, selectedQuoteAssets, setSelectedQuoteAssets } = useMixNMatchContext();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedExchanges, setExpandedExchanges] = useState<Set<string>>(new Set());
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [totalSelectedMarkets, setTotalSelectedMarkets] = useState(0);

  useEffect(() => {
    async function fetchAllMarkets() {
      if (Object.keys(groupedMarkets).length > 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [
          binanceSpot,
          binanceFutures,
          bybitSpot,
          bybitFutures,
          bitgetSpot,
          bitgetFutures,
          kucoinSpot,
          kucoinFutures,
          bitfinexSpot,
          dydxMarkets,
          okxSpot,
          okxFutures,
          mexcSpot,
          mexcFutures,
          poloniexSpot,
          krakenSpot,
          cryptocomSpot,
          coinbaseSpot,
          gateSpot,
          phemexSpot,
          phemexFutures
        ] = await Promise.all([
          fetchWithRetry(() => fetchBinanceSpotMarkets()),
          fetchWithRetry(() => fetchBinanceFuturesMarkets()),
          fetchWithRetry(() => fetchBybitSpotMarkets()),
          fetchWithRetry(() => fetchBybitFuturesMarkets()),
          fetchWithRetry(() => fetchBitgetSpotMarkets()),
          fetchWithRetry(() => fetchBitgetFuturesMarkets()),
          fetchWithRetry(() => fetchKucoinSpotMarkets()),
          fetchWithRetry(() => fetchKucoinFuturesMarkets()),
          fetchWithRetry(() => fetchBitfinexSpotMarkets()),
          fetchWithRetry(() => fetchDydxMarkets()),
          fetchWithRetry(() => fetchOkxSpotMarkets()),
          fetchWithRetry(() => fetchOkxFuturesMarkets()),
          fetchWithRetry(() => fetchMexcSpotMarkets()),
          fetchWithRetry(() => fetchMexcFuturesMarkets()),
          fetchWithRetry(() => fetchPoloniexSpotMarkets()),
          fetchWithRetry(() => fetchAllKrakenSpotMarkets()),
          fetchWithRetry(() => fetchCryptocomSpotMarkets()),
          fetchWithRetry(() => fetchCoinbaseMarkets()),
          fetchWithRetry(() => fetchAllGateSpotMarkets()),
          fetchWithRetry(() => fetchPhemexSpotMarkets() as Promise<FetchResult>),
          fetchWithRetry(() => fetchPhemexFuturesMarkets() as Promise<FetchResult>)
        ]);

        const allMarkets: Market[] = [
          ...binanceSpot.markets.map(m => ({ ...m, exchange: 'Binance', type: 'spot' as const })),
          ...binanceFutures.markets.map(m => ({ ...m, exchange: 'Binance', type: 'futures' as const })),
          ...bybitSpot.markets.map(m => ({ ...m, exchange: 'Bybit', type: 'spot' as const })),
          ...bybitFutures.markets.map(m => ({ ...m, exchange: 'Bybit', type: 'futures' as const })),
          ...bitgetSpot.markets.map(m => ({ ...m, exchange: 'Bitget', type: 'spot' as const })),
          ...bitgetFutures.markets.map(m => ({ ...m, exchange: 'Bitget', type: 'futures' as const })),
          ...kucoinSpot.markets.map(m => ({ ...m, exchange: 'KuCoin', type: 'spot' as const })),
          ...kucoinFutures.markets.map(m => ({ ...m, exchange: 'KuCoin', type: 'futures' as const })),
          ...bitfinexSpot.markets.map(m => ({ ...m, exchange: 'Bitfinex', type: 'spot' as const })),
          ...dydxMarkets.markets.map(m => ({ ...m, exchange: 'dYdX', type: 'futures' as const })),
          ...okxSpot.markets.map(m => ({ ...m, exchange: 'OKX', type: 'spot' as const })),
          ...okxFutures.markets.map(m => ({ ...m, exchange: 'OKX', type: 'futures' as const })),
          ...mexcSpot.markets.map(m => ({ ...m, exchange: 'MEXC', type: 'spot' as const })),
          ...mexcFutures.markets.map(m => ({ ...m, exchange: 'MEXC', type: 'futures' as const })),
          ...poloniexSpot.markets.map(m => ({ ...m, exchange: 'Poloniex', type: 'spot' as const })),
          ...krakenSpot.markets.map(m => ({ ...m, exchange: 'Kraken', type: 'spot' as const })),
          ...cryptocomSpot.markets.map(m => ({ ...m, exchange: 'Crypto.com', type: 'spot' as const })),
          ...coinbaseSpot.markets.map(m => ({ ...m, exchange: 'Coinbase', type: 'spot' as const })),
          ...gateSpot.markets.map(m => ({ ...m, exchange: 'Gate.io', type: 'spot' as const })),
          ...phemexSpot.markets.map(m => ({ ...m, exchange: 'Phemex', type: 'spot' as const })),
          ...phemexFutures.markets.map(m => ({ ...m, exchange: 'Phemex', type: 'futures' as const }))
        ];

        const grouped = allMarkets.reduce((acc, market) => {
          if (!acc[market.exchange]) {
            acc[market.exchange] = { spot: {}, futures: {} };
          }
          const typeObj = acc[market.exchange][market.type];
          if (!typeObj[market.quoteAsset]) {
            typeObj[market.quoteAsset] = [];
          }
          typeObj[market.quoteAsset].push(market);
          return acc;
        }, {} as GroupedMarkets);

        setGroupedMarkets(grouped);
      } catch (error) {
        console.error('Error fetching markets:', error);
      }
      setLoading(false);
    }

    fetchAllMarkets();
  }, [groupedMarkets, setGroupedMarkets]);

  const handleQuoteAssetSelect = (exchange: string, quoteAsset: string, type: 'spot' | 'futures') => {
    setSelectedQuoteAssets(prev => {
      const key = `${exchange}-${quoteAsset}-${type}`;
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      
      // Calculate total selected markets
      const newTotalSelectedMarkets = Array.from(newSet).reduce((acc, key) => {
        const [ex, qa, t] = key.split('-');
        return acc + groupedMarkets[ex][t as 'spot' | 'futures'][qa].length;
      }, 0);
      
      setTotalSelectedMarkets(newTotalSelectedMarkets);
      setShowWarning(newTotalSelectedMarkets > 1000);
      
      return newSet;
    });
  };

  const handleDownload = async () => {
    const selectedMarkets = Array.from(selectedQuoteAssets).flatMap(key => {
      const [exchange, quoteAsset, type] = key.split('-');
      return groupedMarkets[exchange][type as 'spot' | 'futures'][quoteAsset].map(m => m.symbol);
    });
    
    setShowSupportChat(true);
    
    // Delay the download process by 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const batchSize = 999;
    const batches = Math.ceil(selectedMarkets.length / batchSize);

    if (selectedMarkets.length > 1000) {
      setShowWarning(true);
    }

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min((i + 1) * batchSize, selectedMarkets.length);
      const batchMarkets = selectedMarkets.slice(start, end);
      const content = batchMarkets.join(',');
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `custom_watchlist_batch${i + 1}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Add a small delay between downloads to prevent browser throttling
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Show download popup and close support chat
    setTimeout(() => {
      setShowSupportChat(false);
      setShowWarning(false);
      setShowDownloadPopup(true);
    }, 2000);

    // Auto close download popup after 10 seconds
    setTimeout(() => {
      setShowDownloadPopup(false);
    }, 12000);
  };

  const toggleExchangeExpansion = (exchange: string) => {
    setExpandedExchanges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exchange)) {
        newSet.delete(exchange);
      } else {
        newSet.add(exchange);
      }
      return newSet;
    });
  };

  const getTotalMarkets = (markets: { spot: Record<string, Market[]>, futures: Record<string, Market[]> }) => {
    const spotTotal = Object.values(markets.spot).reduce((acc, curr) => acc + curr.length, 0);
    const futuresTotal = Object.values(markets.futures).reduce((acc, curr) => acc + curr.length, 0);
    return spotTotal + futuresTotal;
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading markets...</div>;

  const themeClass = isDarkMode ? 'bg-ftx-dark-blue text-white' : 'bg-white text-ftx-dark-blue';
  const headerClass = isDarkMode ? 'bg-ftx-teal text-white' : 'bg-ftx-light-gray text-ftx-dark-blue';
  const rowClass = isDarkMode ? 'bg-ftx-dark-blue-light' : 'bg-white';
  const rowHoverClass = isDarkMode ? 'hover:bg-ftx-dark-gray' : 'hover:bg-ftx-light-gray';
  const buttonClass = isDarkMode 
    ? 'bg-ftx-teal hover:bg-opacity-90 text-white' 
    : 'bg-ftx-teal hover:bg-opacity-90 text-white';

  const filteredMarkets = Object.entries(groupedMarkets).filter(([exchange]) => 
    exchange.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`p-4 ${themeClass}`}>
      <h1 className="text-2xl font-bold mb-4">Mix N&apos; Match Mode</h1>
      <div className="mb-4 flex items-center">
        <Search className="mr-2" />
        <input
          type="text"
          placeholder="Search exchanges..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-2 rounded ${isDarkMode ? 'bg-ftx-dark-blue-light text-white' : 'bg-white text-ftx-dark-blue'}`}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${headerClass} sticky top-0 z-10`}>
            <tr>
              <th className="p-2 text-left font-bold">Exchange</th>
              <th className="p-2 text-left font-bold">Total Markets</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarkets.map(([exchange, markets]) => (
              <React.Fragment key={exchange}>
                <tr className={`${rowClass} ${rowHoverClass} border-b border-gray-700 cursor-pointer`} onClick={() => toggleExchangeExpansion(exchange)}>
                  <td className="p-2 font-medium flex items-center">
                    {expandedExchanges.has(exchange) ? <ChevronDown className="mr-2" /> : <ChevronRight className="mr-2" />}
                    {exchange}
                  </td>
                  <td className="p-2">{getTotalMarkets(markets)} markets</td>
                </tr>
                {expandedExchanges.has(exchange) && (
                  <tr className={rowClass}>
                    <td colSpan={2} className="p-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">Spot Markets</h3>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(markets.spot).map(([quoteAsset, spotMarkets]) => (
                              <div key={`${exchange}-${quoteAsset}-spot`} className="flex items-center bg-opacity-20 bg-ftx-teal rounded p-1">
                                <Checkbox
                                  id={`${exchange}-${quoteAsset}-spot`}
                                  checked={selectedQuoteAssets.has(`${exchange}-${quoteAsset}-spot`)}
                                  onCheckedChange={() => handleQuoteAssetSelect(exchange, quoteAsset, 'spot')}
                                  className="mr-2 border-2 border-ftx-teal"
                                />
                                <label htmlFor={`${exchange}-${quoteAsset}-spot`} className="text-sm">
                                  {quoteAsset} ({spotMarkets.length})
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Futures Markets</h3>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(markets.futures).map(([quoteAsset, futuresMarkets]) => (
                              <div key={`${exchange}-${quoteAsset}-futures`} className="flex items-center bg-opacity-20 bg-ftx-teal rounded p-1">
                                <Checkbox
                                  id={`${exchange}-${quoteAsset}-futures`}
                                  checked={selectedQuoteAssets.has(`${exchange}-${quoteAsset}-futures`)}
                                  onCheckedChange={() => handleQuoteAssetSelect(exchange, quoteAsset, 'futures')}
                                  className="mr-2 border-2 border-ftx-teal"
                                />
                                <label htmlFor={`${exchange}-${quoteAsset}-futures`} className="text-sm">
                                  {quoteAsset} ({futuresMarkets.length})
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div>
          Selected Markets: {totalSelectedMarkets}
        </div>
        <div className="flex flex-col items-end">
          {showWarning && (
            <p className="text-sm text-yellow-500 mb-2">
              Note: More than 1000 assets selected. The download will be split into multiple files.
            </p>
          )}
          <Button 
            onClick={handleDownload} 
            disabled={selectedQuoteAssets.size === 0}
            className={`${buttonClass} transition-colors duration-300`}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Watchlist
          </Button>
        </div>
      </div>
      
      <FakeSupportChat
        isDarkMode={isDarkMode}
        isOpen={showSupportChat}
        onClose={() => setShowSupportChat(false)}
      />
      <DownloadPopup
        isDarkMode={isDarkMode}
        isOpen={showDownloadPopup}
        onClose={() => setShowDownloadPopup(false)}
      />
    </div>
  );
}
