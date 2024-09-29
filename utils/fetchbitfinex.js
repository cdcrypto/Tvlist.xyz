const fetch = require('node-fetch');

const SPOT_API_URL = '/api/bitfinex?url=https://api.bitfinex.com/v1/symbols_details';
const FUTURES_API_URL = '/api/bitfinex?url=https://api-pub.bitfinex.com/v2/conf/pub:info:pair:futures';

async function fetchMarkets(url, isSpot) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        let symbols = [];

        if (isSpot) {
            // For spot markets, data is an array of symbol details
            symbols = data;
        } else {
            // For futures markets, data is [[ [symbol, ...], ... ]]
            symbols = data[0];
        }

        const KNOWN_QUOTES = ['USD', 'USDT', 'BTC', 'ETH', 'EUR', 'GBP', 'JPY', 'UST', 'EOS', 'XLM', 'DASH'];

        const markets = symbols.map(symbol => {
            if (isSpot) {
                // For spot, 'pair' is like 'btcusd'
                let pair = symbol.pair.toUpperCase();

                // Try to split pair into base and quote assets
                let baseAsset = null;
                let quoteAsset = null;

                for (let quote of KNOWN_QUOTES) {
                    if (pair.endsWith(quote)) {
                        baseAsset = pair.slice(0, -quote.length);
                        quoteAsset = quote;
                        break;
                    }
                }

                if (!baseAsset || !quoteAsset) {
                    // Unable to split, skip this symbol
                    return null;
                }

                return {
                    symbol: `BITFINEX:${pair}`,
                    baseAsset: baseAsset,
                    quoteAsset: quoteAsset
                };
            } else {
                // For futures, symbol is an array, symbol[0] is the symbol string
                let symbolStr = symbol[0].substring(1); // Remove leading 't'
                // symbolStr is like 'BTCF0:USTF0'

                let assets = symbolStr.split(':');
                if (assets.length === 2) {
                    let baseAsset = assets[0].replace('F0', '');
                    let quoteAsset = assets[1].replace('F0', '');

                    return {
                        symbol: `BITFINEX:${symbolStr}`,
                        baseAsset: baseAsset,
                        quoteAsset: quoteAsset
                    };
                } else {
                    // Unable to split, skip
                    return null;
                }
            }
        }).filter(market => market !== null);

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
