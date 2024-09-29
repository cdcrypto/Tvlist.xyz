const fetch = require('node-fetch');

const API_URL = '/api/dydx?url=https://api.dydx.exchange/v3/markets';

async function fetchMarkets() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.markets) {
            throw new Error('Invalid response from DYDX API');
        }

        const marketsData = data.markets;
        const symbols = Object.keys(marketsData);

        const markets = symbols.map(symbol => {
            const market = marketsData[symbol];
            return {
                symbol: `DYDX:${market.market.replace('-', '')}.P`, // Remove hyphen and add '.P' suffix
                baseAsset: market.baseAsset,
                quoteAsset: market.quoteAsset
            };
        });

        const quoteAssets = [...new Set(markets.map(market => market.quoteAsset))].sort();

        const assetCounts = quoteAssets.reduce((acc, asset) => {
            acc[asset] = markets.filter(market => market.quoteAsset === asset).length;
            return acc;
        }, {});

        return { markets, assetCounts, quoteAssets };
    } catch (error) {
        console.error('Error fetching DYDX markets:', error);
        return { markets: [], assetCounts: {}, quoteAssets: [] };
    }
}

export async function fetchAllMarkets() {
    return fetchMarkets();
}
