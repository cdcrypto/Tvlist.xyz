const fetch = require('node-fetch');

const SPOT_API_URL = 'https://api.bitget.com/api/v2/spot/public/symbols';
const FUTURES_API_URL = 'https://api.bitget.com/api/v2/mix/market/tickers?productType=USDT-FUTURES';

async function fetchMarkets(url, isSpot) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code !== '00000') {
            throw new Error(`API returned error: ${data.msg}`);
        }

        let symbols = data.data;

        const markets = symbols.map(symbol => {
            let baseAsset = '';
            let quoteAsset = '';
            let cleanSymbol = '';

            if (isSpot) {
                baseAsset = symbol.baseCoin;
                quoteAsset = symbol.quoteCoin;
                cleanSymbol = symbol.symbol;
            } else {
                // Futures market symbol parsing
                cleanSymbol = symbol.symbol.split('_')[0];
                
                // For USDT-FUTURES, we know the quote asset is always USDT
                quoteAsset = 'USDT';
                
                // The base asset is everything except the last 4 characters (USDT)
                baseAsset = cleanSymbol.slice(0, -4);
            }

            return {
                symbol: `BITGET:${cleanSymbol}${isSpot ? '' : '.P'}`,
                baseAsset,
                quoteAsset
            };
        });

        // Filter out markets where baseAsset or quoteAsset couldn't be determined
        const validMarkets = markets.filter(market => market.baseAsset && market.quoteAsset);

        const quoteAssets = [...new Set(validMarkets.map(market => market.quoteAsset))].sort();

        const assetCounts = quoteAssets.reduce((acc, asset) => {
            acc[asset] = validMarkets.filter(market => market.quoteAsset === asset).length;
            return acc;
        }, {});

        return { markets: validMarkets, assetCounts, quoteAssets };
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
