const fetch = require('node-fetch');

const SPOT_API_URL = '/api/okx?url=https://www.okx.com/api/v5/public/instruments?instType=SPOT';
const SWAP_API_URL = '/api/okx?url=https://www.okx.com/api/v5/public/instruments?instType=SWAP';

async function fetchMarkets(url, instType) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code !== '0') {
            throw new Error(`API returned error: ${data.msg}`);
        }

        const instruments = data.data;
        const statusToMatch = 'live'; // 'live' indicates active markets on OKX

        const isSpot = instType === 'SPOT';

        const markets = instruments
            .filter(instrument => instrument.state === statusToMatch)
            .map(instrument => {
                // Remove all hyphens for TradingView compatibility
                let symbol = instrument.instId.replace(/-/g, '');

                if (!isSpot) {
                    // For SWAP markets, remove 'SWAP' suffix if present
                    symbol = symbol.replace('SWAP', '');
                }

                // Determine the quote asset
                let quoteAsset;
                if (isSpot) {
                    quoteAsset = instrument.quoteCcy;
                } else {
                    // For futures, check if it ends with USDT or USD
                    if (symbol.endsWith('USDT')) {
                        quoteAsset = 'USDT';
                    } else if (symbol.endsWith('USD')) {
                        quoteAsset = 'USD';
                    } else {
                        // If it doesn't end with either, use the settleCcy
                        quoteAsset = instrument.settleCcy;
                    }
                }

                return {
                    symbol: `OKX:${symbol}${isSpot ? '' : '.P'}`,
                    baseAsset: instrument.baseCcy,
                    quoteAsset: quoteAsset
                };
            });

        const quoteAssets = [...new Set(markets.map(market => market.quoteAsset))].sort();

        const assetCounts = quoteAssets.reduce((acc, asset) => {
            acc[asset] = markets.filter(market => market.quoteAsset === asset).length;
            return acc;
        }, {});

        return { markets, assetCounts, quoteAssets };
    } catch (error) {
        console.error(`Error fetching ${instType} markets:`, error);
        return { markets: [], assetCounts: {}, quoteAssets: [] };
    }
}

export async function fetchAllSpotMarkets() {
    return fetchMarkets(SPOT_API_URL, 'SPOT');
}

export async function fetchAllFuturesMarkets() {
    return fetchMarkets(SWAP_API_URL, 'SWAP');
}
