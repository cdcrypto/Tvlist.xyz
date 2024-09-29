'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, LineChart, Zap, X } from 'lucide-react'
import { fetchAllSpotMarkets as fetchBinanceSpotMarkets, fetchAllFuturesMarkets as fetchBinanceFuturesMarkets } from '@/utils/fetchmarkets'
import { fetchAllSpotMarkets as fetchBybitSpotMarkets, fetchAllFuturesMarkets as fetchBybitFuturesMarkets } from '@/utils/fetchbybit'
import { fetchAllSpotMarkets as fetchBitgetSpotMarkets, fetchAllFuturesMarkets as fetchBitgetFuturesMarkets } from '@/utils/fetchbitget'
import { fetchAllSpotMarkets as fetchKucoinSpotMarkets, fetchAllFuturesMarkets as fetchKucoinFuturesMarkets } from '@/utils/fetchkucoin'
import { fetchAllSpotMarkets as fetchBitfinexSpotMarkets } from '@/utils/fetchbitfinex'
import { fetchAllMarkets as fetchDydxMarkets } from '@/utils/fetchdydx'
import { fetchAllSpotMarkets as fetchOkxSpotMarkets, fetchAllFuturesMarkets as fetchOkxFuturesMarkets } from '@/utils/fetchokx'
import { fetchAllSpotMarkets as fetchMexcSpotMarkets, fetchAllFuturesMarkets as fetchMexcFuturesMarkets } from '@/utils/fetchmexc'
import { fetchAllSpotMarkets as fetchPoloniexSpotMarkets } from '@/utils/fetchpoloniex'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { fetchAllKrakenSpotMarkets } from '@/utils/fetchkraken'
import { fetchAllSpotMarkets as fetchCryptocomSpotMarkets } from '@/utils/fetchcryptocom'
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const spotExchanges = [
  {
    name: 'Binance',
    logo: 'https://assets.coingecko.com/markets/images/52/small/binance.jpg?1519353250',
  },
  {
    name: 'Bybit',
    logo: 'https://assets.coingecko.com/markets/images/698/large/bybit_spot.png?1706864649',
  },
  {
    name: 'Bitget',
    logo: 'https://assets.coingecko.com/markets/images/540/large/2023-07-25_21.47.43.jpg?1706864507',
  },
  {
    name: 'KuCoin',
    logo: 'https://assets.coingecko.com/markets/images/61/large/kucoin.png?1706864282',
  },
  {
    name: 'Bitfinex',
    logo: 'https://assets.coingecko.com/markets/images/4/small/BItfinex.png?1608742479',
  },
  {
    name: 'OKX',
    logo: 'https://assets.coingecko.com/markets/images/96/large/WeChat_Image_20220117220452.png?1706864283',
  },
  {
    name: 'MEXC',
    logo: 'https://assets.coingecko.com/markets/images/409/large/MEXC_logo_square.jpeg?1706864416',
  },
  {
    name: 'Poloniex',
    logo: 'https://assets.coingecko.com/markets/images/37/large/poloniex.png?1706864269',
  },
  {
    name: 'Kraken',
    logo: 'https://assets.coingecko.com/markets/images/29/small/kraken.jpg?1519353250',
  },
  {
    name: 'Crypto.com',
    logo: 'https://assets.coingecko.com/markets/images/589/small/Crypto.jpg?1639719470',
  },
];

const futuresExchanges = [
  {
    name: 'Binance',
    logo: 'https://assets.coingecko.com/markets/images/52/small/binance.jpg?1519353250',
  },
  {
    name: 'Bybit',
    logo: 'https://assets.coingecko.com/markets/images/698/large/bybit_spot.png?1706864649',
  },
  {
    name: 'Bitget',
    logo: 'https://assets.coingecko.com/markets/images/540/large/2023-07-25_21.47.43.jpg?1706864507',
  },
  {
    name: 'KuCoin',
    logo: 'https://assets.coingecko.com/markets/images/61/large/kucoin.png?1706864282',
  },
  {
    name: 'dYdX',
    logo: 'https://assets.coingecko.com/coins/images/32594/standard/dydx.png?1698673495',
  },
  {
    name: 'OKX',
    logo: 'https://assets.coingecko.com/markets/images/96/large/WeChat_Image_20220117220452.png?1706864283',
  },
  {
    name: 'MEXC',
    logo: 'https://assets.coingecko.com/markets/images/409/large/MEXC_logo_square.jpeg?1706864416',
  },
];


const spotColors = {
  bg: "bg-blue-50",
  card: "bg-white",
  button: "bg-blue-600 hover:bg-blue-700",
  text: "text-blue-800",
};

const futuresColors = {
  bg: "bg-purple-50",
  card: "bg-white",
  button: "bg-purple-600 hover:bg-purple-700",
  text: "text-purple-800",
};

type SyntheticPair = 'BTC' | 'ETH' | 'BNB' | 'SOL';

export function CryptoWatchlistDashboard() {
  const [marketType, setMarketType] = useState('spot')
  const [loading, setLoading] = useState(false)
  const [selectedQuoteAssets, setSelectedQuoteAssets] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [currentExchange, setCurrentExchange] = useState<string | null>(null)
  const [allMarkets, setAllMarkets] = useState<{ symbol: string; quoteAsset: string }[]>([])
  const [assetCounts, setAssetCounts] = useState<Record<string, number>>({})
  const [quoteAssets, setQuoteAssets] = useState<string[]>([])
  const [filteredMarketsCount, setFilteredMarketsCount] = useState(0)
  const [exportAsSynthetic, setExportAsSynthetic] = useState(false)
  const [syntheticBase, setSyntheticBase] = useState<SyntheticPair>('BTC')

  useEffect(() => {
    if (showModal) {
      setLoading(true);
      let fetchFunction;
      if (currentExchange === 'Binance') {
        fetchFunction = marketType === 'spot' ? fetchBinanceSpotMarkets : fetchBinanceFuturesMarkets;
      } else if (currentExchange === 'Bybit') {
        fetchFunction = marketType === 'spot' ? fetchBybitSpotMarkets : fetchBybitFuturesMarkets;
      } else if (currentExchange === 'Bitget') {
        fetchFunction = marketType === 'spot' ? fetchBitgetSpotMarkets : fetchBitgetFuturesMarkets;
      } else if (currentExchange === 'KuCoin') {
        fetchFunction = marketType === 'spot' ? fetchKucoinSpotMarkets : fetchKucoinFuturesMarkets;
      } else if (currentExchange === 'Bitfinex' && marketType === 'spot') {
        fetchFunction = fetchBitfinexSpotMarkets;
      } else if (currentExchange === 'dYdX' && marketType === 'futures') {
        fetchFunction = fetchDydxMarkets;
      } else if (currentExchange === 'OKX') {
        fetchFunction = marketType === 'spot' ? fetchOkxSpotMarkets : fetchOkxFuturesMarkets;
      } else if (currentExchange === 'MEXC') {
        fetchFunction = marketType === 'spot' ? fetchMexcSpotMarkets : fetchMexcFuturesMarkets;
      } else if (currentExchange === 'Poloniex' && marketType === 'spot') {
        fetchFunction = fetchPoloniexSpotMarkets;
      } else if (currentExchange === 'Kraken' && marketType === 'spot') {
        fetchFunction = fetchAllKrakenSpotMarkets;
      } else if (currentExchange === 'Crypto.com' && marketType === 'spot') {
        fetchFunction = fetchCryptocomSpotMarkets;
      }
      
      if (fetchFunction) {
        fetchFunction().then(({ markets, assetCounts, quoteAssets }) => {
          setAllMarkets(markets);
          setAssetCounts(assetCounts);
          setQuoteAssets(quoteAssets);
          setLoading(false);
        });
      }
    }
  }, [showModal, marketType, currentExchange]);

  useEffect(() => {
    const filteredMarkets = allMarkets.filter(market => 
      selectedQuoteAssets.includes(market.quoteAsset)
    );
    setFilteredMarketsCount(filteredMarkets.length);
  }, [selectedQuoteAssets, allMarkets]);

  const sortedQuoteAssets = useMemo(() => {
    return [...quoteAssets].sort((a, b) => assetCounts[b] - assetCounts[a]);
  }, [quoteAssets, assetCounts]);

  const handleQuoteAssetChange = (quoteAsset: string) => {
    setSelectedQuoteAssets(prev => 
      prev.includes(quoteAsset) 
        ? prev.filter(asset => asset !== quoteAsset)
        : [...prev, quoteAsset]
    )
  }

  const handleChoosePairs = (exchange: string) => {
    setCurrentExchange(exchange)
    setSelectedQuoteAssets([]) // Clear selected assets when opening modal
    setShowModal(true)
  }

  const handleMarketTypeChange = (type: 'spot' | 'futures') => {
    setMarketType(type)
    setSelectedQuoteAssets([]) // Clear selected assets when changing market type
    setAllMarkets([])
    setAssetCounts({})
    setQuoteAssets([])
  }

  const handleDownload = async () => {
    if (!currentExchange) {
      console.log(`No exchange selected`)
      return
    }

    setLoading(true)
    try {
      const syntheticPairs: Record<SyntheticPair, string> = {
        BTC: 'BINANCE:BTCUSDT',
        ETH: 'BINANCE:ETHUSDT',
        BNB: 'BINANCE:BNBUSDT',
        SOL: 'BINANCE:SOLUSDT'
      }

      const markets = allMarkets
        .filter(market => selectedQuoteAssets.includes(market.quoteAsset))
        .map(market => {
          const symbol = market.symbol;
          return exportAsSynthetic
            ? `${symbol}/${syntheticPairs[syntheticBase]}`
            : symbol;
        });

      const batchSize = 999;
      const batches = Math.ceil(markets.length / batchSize);

      for (let i = 0; i < batches; i++) {
        const start = i * batchSize;
        const end = Math.min((i + 1) * batchSize, markets.length);
        const batchMarkets = markets.slice(start, end);
        const content = batchMarkets.join(',');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentExchange.toLowerCase()}_${marketType}_markets_batch${i + 1}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Add a small delay between downloads to prevent browser throttling
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error downloading markets:', error);
    } finally {
      setLoading(false);
    }
  };

  const colors = marketType === 'spot' ? spotColors : futuresColors;
  const exchanges = marketType === 'spot' ? spotExchanges : futuresExchanges;

  return (
    <div className={`min-h-screen ${colors.bg} p-8`}>
      <header className="mb-12 text-center">
        <h1 className={`text-4xl font-bold mb-4 ${colors.text}`}>Crypto Watchlist Downloader</h1>
        <p className={colors.text}>Download TradingView watchlists for major cryptocurrency exchanges</p>
      </header>

      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex justify-center space-x-4 mb-6">
          <Button
            variant={marketType === 'spot' ? 'default' : 'outline'}
            onClick={() => handleMarketTypeChange('spot')}
            className={`w-40 ${marketType === 'spot' ? spotColors.button : ''}`}
          >
            <Zap className="mr-2 h-4 w-4" /> Spot Markets
          </Button>
          <Button
            variant={marketType === 'futures' ? 'default' : 'outline'}
            onClick={() => handleMarketTypeChange('futures')}
            className={`w-40 ${marketType === 'futures' ? futuresColors.button : ''}`}
          >
            <LineChart className="mr-2 h-4 w-4" /> Futures Markets
          </Button>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {exchanges.map((exchange, index) => (
          <motion.div
            key={exchange.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`${colors.card} backdrop-blur-md border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className={`text-xl font-medium ${colors.text}`}>{exchange.name}</CardTitle>
                <img src={exchange.logo} alt={`${exchange.name} logo`} className="w-10 h-10" />
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${colors.text}`}>
                  Download the latest {marketType} market watchlist for {exchange.name}.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${colors.button} text-white transition-colors duration-300`}
                  onClick={() => handleChoosePairs(exchange.name)}
                >
                  Choose Pairs
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${colors.card} rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Select Quote Assets for {currentExchange} ({marketType})</h3>
                <Button variant="ghost" onClick={() => setShowModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Total markets: {allMarkets.length}
              </p>
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id="synthetic-pair"
                  checked={exportAsSynthetic}
                  onCheckedChange={setExportAsSynthetic}
                />
                <Label htmlFor="synthetic-pair">Export as Synthetic pair</Label>
              </div>
              {exportAsSynthetic && (
                <div className="mb-4">
                  <Select value={syntheticBase} onValueChange={setSyntheticBase}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select base asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">BTC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="SOL">SOL</SelectItem>
                      <SelectItem value="BNB">BNB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {loading ? (
                <p>Loading markets...</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {sortedQuoteAssets.map(asset => (
                    <div key={asset} className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                      <Checkbox 
                        id={asset} 
                        checked={selectedQuoteAssets.includes(asset)}
                        onCheckedChange={() => handleQuoteAssetChange(asset)}
                      />
                      <Label htmlFor={asset} className="flex-grow">
                        {asset}
                        <span className="text-xs text-gray-500 ml-1">({assetCounts[asset] || 0})</span>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-600 mb-2">
                Total assets selected: {filteredMarketsCount}
              </p>
              {filteredMarketsCount > 1000 && (
                <p className="text-sm text-yellow-500 mb-4">
                  Note: More than 1000 assets selected. The download will be split into multiple files.
                </p>
              )}
              <Button
                className={`w-full ${colors.button} text-white transition-colors duration-300`}
                onClick={handleDownload}
                disabled={loading || selectedQuoteAssets.length === 0}
              >
                {loading ? 'Loading...' : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download Watchlist
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}