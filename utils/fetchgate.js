const fetch = require('node-fetch');

const GATEIO_API_BASE_URL = '/api/gateio?url=https://api.gateio.ws/api/v4';

// Spot API endpoint for fetching trading pairs
const SPOT_TICKERS_API_URL = `${GATEIO_API_BASE_URL}/spot/tickers`;

/**
 * Fetch and process Spot Markets from Gate.io
 */
async function fetchGateSpotMarkets() {
    try {
        const response = await fetch(SPOT_TICKERS_API_URL);
        const data = await response.json();

        console.log('Gate.io API Response:', JSON.stringify(data, null, 2));

        // Filter out inactive markets if necessary
        const markets = data
            .filter(ticker => ticker.currency_pair) // Ensure the currency pair exists
            .map(ticker => {
                const [baseAsset, quoteAsset] = ticker.currency_pair.split('_');
                return {
                    symbol: `GATEIO:${baseAsset}${quoteAsset}`,
                    baseAsset,
                    quoteAsset
                };
            });

        console.log(`Filtered markets: ${markets.length}`);
        console.log('Sample market:', markets[0]);

        const quoteAssets = [...new Set(markets.map(market => market.quoteAsset))].sort();
        console.log('Quote assets:', quoteAssets);

        const assetCounts = quoteAssets.reduce((acc, asset) => {
            acc[asset] = markets.filter(market => market.quoteAsset === asset).length;
            return acc;
        }, {});
        console.log('Asset counts:', assetCounts);

        return { markets, assetCounts, quoteAssets };
    } catch (error) {
        console.error('Error fetching Gate.io spot markets:', error);
        return { markets: [], assetCounts: {}, quoteAssets: [] };
    }
}

module.exports = {
    fetchAllGateSpotMarkets: fetchGateSpotMarkets,
};
