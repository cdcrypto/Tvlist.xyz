const SPOT_API_URL = '/api/cryptocom?url=https://api.crypto.com/exchange/v1/public/get-tickers';

async function fetchMarkets(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (data.code !== 0) {
            throw new Error(`API returned error: ${data.message}`);
        }

        const tickers = data.result.data;

        const markets = tickers
            .filter(ticker => {
                // Filter for spot markets
                // Assuming spot markets have instrument names without hyphens (e.g., 'BTC_USDT')
                // Non-spot markets like futures often include hyphens (e.g., 'BTCUSD-PERP')
                return !ticker.i.includes('-');
            })
            .map(ticker => {
                const instrumentName = ticker.i; // e.g., 'BTC_USDT'
                const [baseAsset, quoteAsset] = instrumentName.split('_');
                return {
                    symbol: `CRYPTOCOM:${instrumentName.replace('_', '')}`, // Remove underscore here
                    baseAsset,
                    quoteAsset,
                    lastPrice: ticker.a, // Latest trade price
                    bidPrice: ticker.b,  // Best bid price
                    askPrice: ticker.k   // Best ask price
                };
            });

        const quoteAssets = [...new Set(markets.map(market => market.quoteAsset))].sort();

        const assetCounts = quoteAssets.reduce((acc, asset) => {
            acc[asset] = markets.filter(market => market.quoteAsset === asset).length;
            return acc;
        }, {});

        return { markets, assetCounts, quoteAssets };
    } catch (error) {
        console.error('Error fetching spot markets:', error);
        return { markets: [], assetCounts: {}, quoteAssets: [] };
    }
}

export async function fetchAllSpotMarkets() {
    return fetchMarkets(SPOT_API_URL);
}
