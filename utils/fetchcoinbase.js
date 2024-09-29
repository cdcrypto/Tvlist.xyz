// If using Node.js 18+, you can remove the require statement.
// Otherwise, uncomment the following line after installing node-fetch@2
// const fetch = require('node-fetch');

const COINBASE_PUBLIC_API_URL = 'https://api.exchange.coinbase.com/products';

async function fetchMarkets(url) {
    try {
        console.log('Fetching markets from Coinbase Exchange API...');
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // No Authorization header needed for public endpoints
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        console.log('Coinbase API Response:', JSON.stringify(data, null, 2));

        if (!Array.isArray(data)) {
            throw new Error('Invalid API response format: Expected an array of products');
        }

        const products = data;
        console.log(`Total products received: ${products.length}`);

        const markets = products
            .filter(product => product.status === 'online')
            .map(product => ({
                // Remove the hyphen from the symbol
                symbol: `COINBASE:${product.id.replace('-', '')}`,
                baseAsset: product.base_currency,
                quoteAsset: product.quote_currency
            }));

        console.log(`Filtered markets: ${markets.length}`);
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
        console.error('Error fetching markets from Coinbase:', error.message);
        return { markets: [], assetCounts: {}, quoteAssets: [] };
    }
}

async function fetchAllMarkets() {
    console.log('Fetching Coinbase markets...');
    const result = await fetchMarkets(COINBASE_PUBLIC_API_URL);
    console.log('Coinbase markets fetched:', result.markets.length);
    return result;
}

// Export the function using CommonJS syntax
module.exports = {
    fetchAllMarkets
};
