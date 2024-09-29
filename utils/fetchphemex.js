// phemex.js

const fetch = require('node-fetch');

const PHEMEX_API_BASE_URL = '/api/phemex?url=https://api.phemex.com';
const PRODUCTS_API_URL = `${PHEMEX_API_BASE_URL}/public/products`;

/**
 * Fetch and process Phemex products to retrieve Spot or Futures markets
 * @param {string} type - 'Spot' or 'Perpetual'
 * @returns {Promise<{markets: Array, assetCounts: Object, quoteAssets: Array}>}
 */
async function fetchMarkets(type) {
    try {
        const response = await fetch(PRODUCTS_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();

        if (data.code !== 0 || !data.data) {
            throw new Error('Invalid response structure');
        }

        console.log('Phemex API Response:', JSON.stringify(data, null, 2));

        let markets;
        if (type === 'Spot') {
            markets = data.data.products
                .filter(product => product.type === 'Spot' && product.status === 'Listed')
                .map(product => ({
                    symbol: `PHEMEX:${product.symbol}`,
                    baseAsset: product.baseCurrency,
                    quoteAsset: product.quoteCurrency
                }));
        } else {
            markets = data.data.perpProductsV2
                .filter(product => product.type === 'PerpetualV2' && product.status === 'Listed')
                .map(product => ({
                    symbol: `PHEMEX:${product.symbol}.P`,
                    baseAsset: product.baseCurrency,
                    quoteAsset: product.quoteCurrency
                }));
        }

        console.log(`Filtered ${type} markets:`, markets.length);
        if (markets.length > 0) {
            console.log('Sample market:', markets[0]);
        }

        const quoteAssets = [...new Set(markets.map(market => market.quoteAsset))].sort();
        console.log('Quote assets:', quoteAssets);

        const assetCounts = quoteAssets.reduce((acc, asset) => {
            acc[asset] = markets.filter(market => market.quoteAsset === asset).length;
            return acc;
        }, {});
        console.log('Asset counts:', assetCounts);

        return { markets, assetCounts, quoteAssets };
    } catch (error) {
        console.error(`Error fetching ${type} markets from Phemex:`, error);
        throw error;
    }
}

/**
 * Fetch all Spot markets from Phemex
 * @returns {Promise<{markets: Array, assetCounts: Object, quoteAssets: Array}>}
 */
async function fetchAllSpotMarkets() {
    console.log('Fetching Phemex spot markets...');
    return fetchMarkets('Spot');
}

/**
 * Fetch all Futures (Perpetual) markets from Phemex
 * @returns {Promise<{markets: Array, assetCounts: Object, quoteAssets: Array}>}
 */
async function fetchAllFuturesMarkets() {
    console.log('Fetching Phemex futures markets...');
    return fetchMarkets('Perpetual');
}

module.exports = {
    fetchAllSpotMarkets,
    fetchAllFuturesMarkets
};
