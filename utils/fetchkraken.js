const fetch = require('node-fetch');

const KRAKEN_SPOT_API_URL = '/api/kraken?url=https://api.kraken.com/0/public/AssetPairs';

async function fetchKrakenSpotMarkets() {
    try {
        const response = await fetch(KRAKEN_SPOT_API_URL);
        const data = await response.json();

        if (data.error && data.error.length > 0) {
            throw new Error(`API returned error: ${data.error.join(', ')}`);
        }

        const pairs = data.result;
        const symbols = Object.values(pairs);

        const markets = symbols.map(pair => {
            const symbol = `KRAKEN:${pair.altname}`;
            const wsname = pair.wsname || '';
            let [baseAsset, quoteAsset] = wsname.split('/');

            if (!baseAsset || !quoteAsset) {
                // Fallback if wsname is not available
                baseAsset = pair.base.replace(/^X|Z/, '');
                quoteAsset = pair.quote.replace(/^X|Z/, '');
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
        console.error(`Error fetching Kraken spot markets:`, error);
        return { markets: [], assetCounts: {}, quoteAssets: [] };
    }
}

export async function fetchAllKrakenSpotMarkets() {
    return fetchKrakenSpotMarkets();
}

// Remove the fetchAllKrakenFuturesMarkets function
