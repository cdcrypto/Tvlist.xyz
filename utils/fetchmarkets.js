const fetch = require('node-fetch');

const SPOT_API_URL = 'https://api.binance.com/api/v3/exchangeInfo';
const FUTURES_API_URL = 'https://fapi.binance.com/fapi/v1/exchangeInfo';

async function fetchMarkets(url, isSpot) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const markets = data.symbols
            .filter(symbol => symbol.status === 'TRADING' && (isSpot || symbol.contractType === 'PERPETUAL'))
            .map(symbol => {
                return {
                    symbol: `BINANCE:${symbol.symbol}${isSpot ? '' : '.P'}`,
                    baseAsset: symbol.baseAsset,
                    quoteAsset: symbol.quoteAsset
                };
            });

        const quoteAssets = [...new Set(markets.map(market => market.quoteAsset))].sort();

        const assetCounts = quoteAssets.reduce((acc, asset) => {
            acc[asset] = markets.filter(market => market.quoteAsset === asset).length;
            return acc;
        }, {});

        return { markets, assetCounts, quoteAssets };
    } catch (error) {
        console.error(`Error fetching ${isSpot ? 'spot' : 'futures'} markets:`, error);
        return { markets: [], assetCounts: {}, quoteAssets: [] };
    }
}

export async function fetchAllSpotMarkets() {
    return fetchMarkets(SPOT_API_URL, true);
}

export async function fetchAllFuturesMarkets() {
    return fetchMarkets(FUTURES_API_URL, false);
}