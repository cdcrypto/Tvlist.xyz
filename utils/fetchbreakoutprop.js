const fetch = require('node-fetch');

const API_URL = '/api/breakoutprop';

async function fetchMarkets() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    // Extract the formatted symbols from the API response
    const markets = data.formattedSymbols.map(symbol => {
      // Extract the base and quote assets from the symbol
      // Format is BYBIT:BTCUSDT.P
      const ticker = symbol.split(':')[1].replace('.P', '');
      let baseAsset, quoteAsset;
      
      if (ticker.endsWith('USDT')) {
        baseAsset = ticker.replace('USDT', '');
        quoteAsset = 'USDT';
      } else if (ticker === 'ETHBTC') {
        baseAsset = 'ETH';
        quoteAsset = 'BTC';
      } else {
        // Default fallback
        baseAsset = ticker;
        quoteAsset = 'USDT';
      }
      
      return {
        symbol,
        baseAsset,
        quoteAsset
      };
    });
    
    const quoteAssets = [...new Set(markets.map(market => market.quoteAsset))].sort();
    
    const assetCounts = quoteAssets.reduce((acc, asset) => {
      acc[asset] = markets.filter(market => market.quoteAsset === asset).length;
      return acc;
    }, {});
    
    return { markets, assetCounts, quoteAssets };
  } catch (error) {
    console.error('Error fetching Breakout Prop markets:', error);
    return { markets: [], assetCounts: {}, quoteAssets: [] };
  }
}

export async function fetchAllMarkets() {
  return fetchMarkets();
} 