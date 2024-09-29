// fetchbybit.js

const SPOT_API_URL = '/api/bybit?url=https://api.bybit.com/v5/market/instruments-info?category=spot';
const FUTURES_API_URL = '/api/bybit?url=https://api.bybit.com/v5/market/instruments-info?category=linear';

async function fetchMarkets(url, isSpot) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.retCode !== 0) {
            throw new Error(`API returned error: ${data.retMsg || 'Unknown error'}`);
        }

        let symbols = data.result.list;
        let statusToMatch = 'Trading'; // Default status for both spot and futures markets

        const markets = symbols
            .filter(symbol => symbol.status === statusToMatch)
            .map(symbol => {
                return {
                    symbol: `BYBIT:${symbol.symbol}${isSpot ? '' : '.P'}`,
                    baseAsset: symbol.baseCoin,
                    quoteAsset: symbol.quoteCoin
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
        throw error; // Re-throw the error to be handled by the caller
    }
}

export async function fetchAllSpotMarkets() {
    return fetchMarkets(SPOT_API_URL, true);
}

export async function fetchAllFuturesMarkets() {
    return fetchMarkets(FUTURES_API_URL, false);
}
