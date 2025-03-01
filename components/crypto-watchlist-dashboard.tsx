'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
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
import Header from './Header'
import { MixNMatchMode } from './MixNMatchMode'
import FakeSupportChat from './FakeSupportChat'
import { fetchAllMarkets as fetchCoinbaseMarkets } from '@/utils/fetchcoinbase';
import { fetchAllGateSpotMarkets } from '@/utils/fetchgate';
import { fetchAllSpotMarkets as fetchPhemexSpotMarkets, fetchAllFuturesMarkets as fetchPhemexFuturesMarkets } from '@/utils/fetchphemex';
import { fetchAllMarkets as fetchBreakoutPropMarkets } from '@/utils/fetchbreakoutprop';
import { useTheme } from 'next-themes';
import { DownloadPopup } from './DownloadPopup'

interface FetchResult {
  markets: { symbol: string; baseAsset: string; quoteAsset: string }[];
  assetCounts: Record<string, number>;
  quoteAssets: string[];
}

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
  {
    name: 'Coinbase',
    logo: 'https://assets.coingecko.com/markets/images/23/large/Coinbase_Coin_Primary.png?1706864258',
  },
  {
    name: 'Gate.io',
    logo: 'https://assets.coingecko.com/markets/images/60/large/gate_io_logo1.jpg?1706864280',
  },
  {
    name: 'Phemex',
    logo: 'https://assets.coingecko.com/coins/images/33314/standard/phemex_logo.png?1701959611',
  }
]

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
  {
    name: 'Phemex',
    logo: 'https://assets.coingecko.com/coins/images/33314/standard/phemex_logo.png?1701959611',
  },
  {
    name: 'Breakout Prop',
    logo: 'https://s3-eu-west-1.amazonaws.com/tpd/logos/64e6c9c34586776535d6e2ba/0x0.png',
  },
  // Gate.io removed from futures exchanges
]

const colorScheme = {
  light: {
    bg: "bg-white",
    card: "bg-ftx-light-gray",
    button: {
      active: "bg-ftx-teal hover:bg-opacity-90 text-white",
      inactive: "bg-white hover:bg-ftx-light-gray text-ftx-dark-blue border border-ftx-teal"
    },
    text: "text-ftx-dark-blue",
    modal: "bg-white",
    modalText: "text-ftx-dark-blue",
    checkbox: "bg-white border border-ftx-teal",
    checkboxText: "text-ftx-dark-blue",
    logoBorder: "bg-ftx-light-gray border border-ftx-teal",
    toggle: "bg-ftx-teal",
  },
  dark: {
    bg: "bg-ftx-dark-blue",
    card: "bg-ftx-dark-blue-light",
    button: {
      active: "bg-ftx-teal hover:bg-opacity-90 text-white",
      inactive: "bg-ftx-dark-blue-light hover:bg-ftx-dark-gray text-ftx-teal border border-ftx-teal"
    },
    text: "text-white",
    modal: "bg-ftx-dark-blue-light",
    modalText: "text-white",
    checkbox: "bg-ftx-dark-gray",
    checkboxText: "text-white",
    logoBorder: "bg-ftx-dark-blue-light border border-ftx-teal",
    toggle: "bg-ftx-dark-blue-light",
  }
}

type SyntheticPair = 'BTC' | 'ETH' | 'BNB' | 'SOL'

const ExchangeCard = React.memo(({ exchange, colors, isShaking, isUnclickable, handleChoosePairs }: {
  exchange: { name: string; logo: string };
  colors: typeof colorScheme.light | typeof colorScheme.dark;
  isShaking: boolean;
  isUnclickable: boolean;
  handleChoosePairs: (name: string) => void;
}) => (
  <Card 
    className={`${colors.card} backdrop-blur-md border ${isUnclickable ? 'border-neon-green' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-shadow duration-300 ${isShaking ? 'animate-shake' : ''}`}
  >
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className={`text-xl font-medium ${colors.text}`}>{exchange.name}</CardTitle>
      <div className={`rounded-full p-1 ${colors.logoBorder}`}>
        <Image 
          src={exchange.logo} 
          alt={`${exchange.name} logo`} 
          width={40} 
          height={40} 
          className="rounded-full"
        />
      </div>
    </CardHeader>
    <CardContent>
      <p className={`text-sm ${colors.text}`}>
        Download the latest market watchlist for {exchange.name}.
      </p>
    </CardContent>
    <CardFooter>
      <Button
        className={`w-full ${colors.button.active} transition-colors duration-300`}
        onClick={() => handleChoosePairs(exchange.name)}
      >
        Choose Pairs
      </Button>
    </CardFooter>
  </Card>
))

ExchangeCard.displayName = 'ExchangeCard'

export function CryptoWatchlistDashboard() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [marketType, setMarketType] = useState<'spot' | 'futures'>('spot')
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
  const [allAssetsSelected, setAllAssetsSelected] = useState(false);
  const [showBackgroundGif, setShowBackgroundGif] = useState(false);
  const [hasSelectedFutures, setHasSelectedFutures] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isMixNMatchMode, setIsMixNMatchMode] = useState(false);
  const [backgroundGifLoaded, setBackgroundGifLoaded] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showMixNMatchGif, setShowMixNMatchGif] = useState(false);
  const [mixNMatchGifLoaded, setMixNMatchGifLoaded] = useState(false);
  const [isPixelated, setIsPixelated] = useState(false);
  const [hasMixNMatchBeenActivated, setHasMixNMatchBeenActivated] = useState(false);
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      const futuresGif = new window.Image();
      futuresGif.onload = () => setBackgroundGifLoaded(true);
      futuresGif.src = "https://s11.gifyu.com/images/SAtDO.gif";

      const mixNMatchGif = new window.Image();
      mixNMatchGif.onload = () => setMixNMatchGifLoaded(true);
      mixNMatchGif.src = "https://s1.gifyu.com/images/SA5EY.gif";
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      setLoading(true);
      let fetchFunction: (() => Promise<FetchResult>) | null = null;
      
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
      } else if (currentExchange === 'Coinbase' && marketType === 'spot') {
        fetchFunction = fetchCoinbaseMarkets;
      } else if (currentExchange === 'Gate.io' && marketType === 'spot') {
        fetchFunction = fetchAllGateSpotMarkets;
      } else if (currentExchange === 'Phemex') {
        fetchFunction = marketType === 'spot' ? fetchPhemexSpotMarkets : fetchPhemexFuturesMarkets;
      } else if (currentExchange === 'Breakout Prop') {
        fetchFunction = fetchBreakoutPropMarkets;
      }
      
      if (fetchFunction) {
        fetchFunction().then(({ markets, assetCounts, quoteAssets }: FetchResult) => {
          setAllMarkets(markets);
          setAssetCounts(assetCounts);
          setQuoteAssets(quoteAssets);
          setLoading(false);
        }).catch((error: Error) => {
          console.error('Error fetching markets:', error);
          setLoading(false);
          // Display error to the user
          alert(`Error fetching markets: ${error.message}`);
        });
      }
    }
  }, [showModal, marketType, currentExchange]);

  useEffect(() => {
    const filteredMarkets = allMarkets.filter(market => 
      selectedQuoteAssets.includes(market.quoteAsset)
    )
    setFilteredMarketsCount(filteredMarkets.length)
  }, [selectedQuoteAssets, allMarkets])

  const sortedQuoteAssets = useMemo(() => {
    return [...quoteAssets].sort((a, b) => (assetCounts[b] || 0) - (assetCounts[a] || 0))
  }, [quoteAssets, assetCounts])

  const handleQuoteAssetChange = (quoteAsset: string) => {
    setSelectedQuoteAssets(prev => {
      const newSelection = prev.includes(quoteAsset)
        ? prev.filter(asset => asset !== quoteAsset)
        : [...prev, quoteAsset]
      setAllAssetsSelected(newSelection.length === quoteAssets.length)
      return newSelection
    })
  }

  const handleChoosePairs = useCallback((exchange: string) => {
    setCurrentExchange(exchange)
    setSelectedQuoteAssets([])
    setAllAssetsSelected(false)
    setShowModal(true)
  }, [])

  const handleMarketTypeChange = useCallback((type: 'spot' | 'futures') => {
    setMarketType(type)
    setSelectedQuoteAssets([])
    setAllMarkets([])
    setAssetCounts({})
    setQuoteAssets([])

    if (type === 'futures' && !hasSelectedFutures) {
      setShowBackgroundGif(true)
      setIsShaking(true)
      setHasSelectedFutures(true)
      setTimeout(() => {
        setShowBackgroundGif(false)
        setIsShaking(false)
        setIsExploding(true)
        setTimeout(() => {
          setIsExploding(false)
        }, 500)
      }, 5000)
    }
  }, [hasSelectedFutures])

  const handleSyntheticBaseChange = (value: string) => {
    setSyntheticBase(value as SyntheticPair)
  }

  const handleDownload = async () => {
    if (!currentExchange) {
      console.log(`No exchange selected`)
      return
    }

    setLoading(true)
    setShowSupportChat(true)

    // Delay the download process by 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

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
          const symbol = market.symbol
          return exportAsSynthetic
            ? `${symbol}/${syntheticPairs[syntheticBase]}`
            : symbol
        })

      const batchSize = 999
      const batches = Math.ceil(markets.length / batchSize)

      for (let i = 0; i < batches; i++) {
        const start = i * batchSize
        const end = Math.min((i + 1) * batchSize, markets.length)
        const batchMarkets = markets.slice(start, end)
        const content = batchMarkets.join(',')
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${currentExchange.toLowerCase()}_${marketType}_markets_batch${i + 1}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        // Add a small delay between downloads to prevent browser throttling
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      setShowModal(false)
      
      // Show download popup and close support chat
      setTimeout(() => {
        setShowSupportChat(false)
        setShowDownloadPopup(true)
      }, 2000)

      // Auto close download popup after 10 seconds
      setTimeout(() => {
        setShowDownloadPopup(false)
      }, 12000)
    } catch (error: unknown) {
      console.error('Error downloading markets:', error)
      if (error instanceof Error) {
        alert(`Error downloading markets: ${error.message}`)
      } else {
        alert('An unknown error occurred while downloading markets.')
      }
    } finally {
      setLoading(false)
    }
  }

  const colors = isDarkMode ? colorScheme.dark : colorScheme.light
  const exchanges = marketType === 'spot' ? spotExchanges : futuresExchanges

  const handleSelectAllAssets = (checked: boolean | 'indeterminate') => {
    const isChecked = checked === true;
    setAllAssetsSelected(isChecked);
    if (isChecked) {
      setSelectedQuoteAssets(quoteAssets);
    } else {
      setSelectedQuoteAssets([]);
    }
  }

  useEffect(() => {
    console.log('showBackgroundGif:', showBackgroundGif)
  }, [showBackgroundGif])

  const resetToHome = useCallback(() => {
    setIsMixNMatchMode(false);
    setMarketType('spot');
    // Add any other state resets you want to perform
  }, []);

  const handleMixNMatchModeChange = (checked: boolean) => {
    setIsMixNMatchMode(checked);
    if (checked && !hasMixNMatchBeenActivated) {
      setShowMixNMatchGif(true);
      setIsPixelated(true);
      setHasMixNMatchBeenActivated(true);
      setTimeout(() => {
        setShowMixNMatchGif(false);
        setIsPixelated(false);
      }, 2500); // Changed from 5000 to 2500 milliseconds (2.5 seconds)
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col ${colors.bg} transition-colors duration-300 ${isPixelated ? 'pixelated-container' : ''}`}>
      <Header resetToHome={resetToHome} />
      <div className="flex-grow">
        {backgroundGifLoaded && (
          <div 
            className={`fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-500 ${showBackgroundGif ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <Image
              src="https://s11.gifyu.com/images/SAtDO.gif"
              alt="Leverage background"
              className="w-full h-full object-cover opacity-50"
              width={1920}
              height={1080}
              unoptimized
            />
          </div>
        )}
        {mixNMatchGifLoaded && (
          <div 
            className={`fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-500 ${showMixNMatchGif ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <div className="w-full h-full overflow-hidden">
              <Image
                src="https://s1.gifyu.com/images/SA5EY.gif"
                alt="Mix N' Match background"
                className="w-full h-full object-cover opacity-50 transform scale-125"
                style={{ transformOrigin: 'center center' }}
                width={1920}
                height={1080}
                unoptimized
              />
            </div>
          </div>
        )}
        <div className={`p-8 relative z-10 min-h-full ${colors.text}`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <div className="w-full sm:w-auto order-2 sm:order-1">
                {!isMixNMatchMode && (
                  <div className="flex justify-center sm:justify-start space-x-4">
                    <Button
                      variant="default"
                      onClick={() => handleMarketTypeChange('spot')}
                      className={`w-40 ${marketType === 'spot' ? colors.button.active : colors.button.inactive}`}
                    >
                      <Zap className="mr-2 h-4 w-4" /> Spot Markets
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handleMarketTypeChange('futures')}
                      className={`w-40 ${marketType === 'futures' ? colors.button.active : colors.button.inactive}`}
                    >
                      <LineChart className="mr-2 h-4 w-4" /> Futures Markets
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto order-1 sm:order-2 justify-center sm:justify-end">
                <span>Mix N&apos; Match Mode</span>
                <Switch
                  checked={isMixNMatchMode}
                  onCheckedChange={handleMixNMatchModeChange}
                  className="h-8" // Increased height here
                />
              </div>
            </div>

            {isMixNMatchMode ? (
              <MixNMatchMode isDarkMode={isDarkMode} />
            ) : (
              <>
                {/* Exchange cards */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {exchanges.map((exchange) => (
                    <motion.div
                      key={exchange.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isExploding ? { 
                        x: Math.random() * 1000 - 500, 
                        y: Math.random() * 1000 - 500, 
                        rotate: Math.random() * 360,
                        opacity: 0
                      } : { opacity: 1, y: 0, x: 0, rotate: 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        duration: isExploding ? 0.5 : 0.5
                      }}
                    >
                      <ExchangeCard
                        exchange={exchange}
                        colors={colors}
                        isShaking={isShaking}
                        isUnclickable={showBackgroundGif || isExploding}
                        handleChoosePairs={handleChoosePairs}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Modal */}
                <AnimatePresence>
                  {showModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className={`${colors.modal} rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className={`text-lg font-semibold ${colors.modalText}`}>Select Quote Assets for {currentExchange} ({marketType})</h3>
                          <Button variant="ghost" onClick={() => setShowModal(false)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className={`text-sm ${colors.modalText} mb-4`}>
                          Total markets: {allMarkets.length}
                        </p>
                        <div className="flex items-center justify-between space-x-2 mb-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="synthetic-pair"
                              checked={exportAsSynthetic}
                              onCheckedChange={setExportAsSynthetic}
                              className={colors.toggle}
                            />
                            <Label htmlFor="synthetic-pair" className={colors.checkboxText}>Export as Synthetic pair</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="select-all" className={colors.checkboxText}>Select All</Label>
                            <Checkbox 
                              id="select-all" 
                              checked={allAssetsSelected}
                              onCheckedChange={handleSelectAllAssets}
                              className="border-2 border-ftx-teal"
                            />
                          </div>
                        </div>
                        {exportAsSynthetic && (
                          <div className="mb-4">
                            <Select value={syntheticBase} onValueChange={handleSyntheticBaseChange}>
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
                              <div key={asset} className={`flex items-center space-x-2 ${colors.checkbox} p-2 rounded`}>
                                <Checkbox 
                                  id={asset} 
                                  checked={selectedQuoteAssets.includes(asset)}
                                  onCheckedChange={() => handleQuoteAssetChange(asset)}
                                  className="border-2 border-ftx-teal"
                                />
                                <Label htmlFor={asset} className={`flex-grow ${colors.checkboxText}`}>
                                  {asset}
                                  <span className="text-xs text-gray-500 ml-1">({assetCounts[asset] || 0})</span>
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className={`text-sm ${colors.modalText} mb-2`}>
                          Total assets selected: {filteredMarketsCount}
                        </p>
                        {filteredMarketsCount > 1000 && (
                          <p className="text-sm text-yellow-500 mb-4">
                            Note: More than 1000 assets selected. The download will be split into multiple files.
                          </p>
                        )}
                        <Button
                          className={`w-full ${colors.button.active} text-white transition-colors duration-300`}
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
              </>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isExploding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white z-50"
          />
        )}
      </AnimatePresence>
      
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
  )
}