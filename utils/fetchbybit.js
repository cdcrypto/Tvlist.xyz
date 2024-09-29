const SPOT_API_URL = `/api/bybit?url=${encodeURIComponent(
    'https://api.bybit.com/v5/market/instruments-info?category=spot'
  )}`;
  const FUTURES_API_URL = `/api/bybit?url=${encodeURIComponent(
    'https://api.bybit.com/v2/public/symbols'
  )}`;
  
  async function fetchMarkets(url, isSpot) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
  
      // Handle different response formats for spot and futures
      const retCode = data.retCode !== undefined ? data.retCode : data.ret_code;
      const retMsg = data.retMsg !== undefined ? data.retMsg : data.ret_msg;
  
      if (retCode !== 0) {
        throw new Error(`API returned error: ${retMsg || 'Unknown error'}`);
      }
  
      let symbols = [];
      let statusToMatch = 'Trading';
  
      if (isSpot) {
        // For spot markets, symbols are in data.result.list
        symbols = data.result.list;
      } else {
        // For futures markets, symbols are in data.result
        symbols = data.result;
      }
  
      const markets = symbols
        .filter((symbol) => symbol.status === statusToMatch)
        .map((symbol) => {
          return {
            symbol: `BYBIT:${isSpot ? symbol.symbol : symbol.name}${isSpot ? '' : '.P'}`,
            baseAsset: symbol.baseCoin || symbol.base_currency,
            quoteAsset: symbol.quoteCoin || symbol.quote_currency,
          };
        });
  
      const quoteAssets = [...new Set(markets.map((market) => market.quoteAsset))].sort();
  
      const assetCounts = quoteAssets.reduce((acc, asset) => {
        acc[asset] = markets.filter((market) => market.quoteAsset === asset).length;
        return acc;
      }, {});
  
      return { markets, assetCounts, quoteAssets };
    } catch (error) {
      console.error(`Error fetching ${isSpot ? 'spot' : 'futures'} markets:`, error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
  
  export async function fetchAllSpotMarkets() {
    return fetchMarkets(SPOT_API_URL, true);
  }
  
  export async function fetchAllFuturesMarkets() {
    return fetchMarkets(FUTURES_API_URL, false);
  }
  