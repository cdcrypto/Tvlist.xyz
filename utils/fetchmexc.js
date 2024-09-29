const fetch = require('node-fetch');

const SPOT_API_URL = '/api/mexc?url=https://www.mexc.com/open/api/v2/market/symbols';
const FUTURES_API_URL = '/api/mexc?url=https://contract.mexc.com/api/v1/contract/detail';

async function fetchSpotMarkets(url) {
    try {
        console.log('Fetching MEXC spot markets from:', url);
        const response = await fetch(url);
        const data = await response.json();

        console.log('MEXC Spot API Response:', JSON.stringify(data, null, 2));

        if (data.code !== 200) {
            throw new Error(`API returned error: ${data.msg}`);
        }

        const symbols = data.data;
        console.log(`Total MEXC spot symbols received: ${symbols.length}`);

        const markets = symbols.map(symbol => {
            const [baseAsset, quoteAsset] = symbol.symbol.split('_');
            return {
                symbol: `MEXC:${symbol.symbol.replace('_', '')}`,
                baseAsset,
                quoteAsset,
                state: symbol.state // Keep this for debugging
            };
        });

        console.log(`Total MEXC spot markets: ${markets.length}`);
        if (markets.length > 0) {
            console.log('Sample MEXC spot market:', markets[0]);
        }

        const quoteAssets = [...new Set(markets.map(market => market.quoteAsset))].sort();
        console.log('MEXC spot quote assets:', quoteAssets);

        const assetCounts = quoteAssets.reduce((acc, asset) => {
            acc[asset] = markets.filter(market => market.quoteAsset === asset).length;
            return acc;
        }, {});
        console.log('MEXC spot asset counts:', assetCounts);

        // Log the count of markets in each state
        const stateCounts = markets.reduce((acc, market) => {
            acc[market.state] = (acc[market.state] || 0) + 1;
            return acc;
        }, {});
        console.log('MEXC spot market state counts:', stateCounts);

        return { markets, assetCounts, quoteAssets };
    } catch (error) {
        console.error(`Error fetching MEXC spot markets:`, error);
        console.error('Error stack:', error.stack);
        return { markets: [], assetCounts: {}, quoteAssets: [] };
    }
}

async function fetchFuturesMarkets(url) {
    try {
        console.log('Fetching MEXC futures markets from:', url);
        const response = await fetch(url);
        const data = await response.json();

        console.log('MEXC Futures API Response:', JSON.stringify(data, null, 2));

        if (data.code !== 0) {
            throw new Error(`API returned error: ${data.msg}`);
        }

        const symbols = data.data;
        console.log(`Total MEXC futures symbols received: ${symbols.length}`);

        const markets = symbols.map(symbol => ({
            symbol: `MEXC:${symbol.symbol.replace('_', '')}.P`,
            baseAsset: symbol.baseCoin,
            quoteAsset: symbol.quoteCoin,
            state: symbol.state // Keep this for debugging
        }));

        console.log(`Total MEXC futures markets: ${markets.length}`);
        if (markets.length > 0) {
            console.log('Sample MEXC futures market:', markets[0]);
        }

        const quoteAssets = [...new Set(markets.map(market => market.quoteAsset))].sort();
        console.log('MEXC futures quote assets:', quoteAssets);

        const assetCounts = quoteAssets.reduce((acc, asset) => {
            acc[asset] = markets.filter(market => market.quoteAsset === asset).length;
            return acc;
        }, {});
        console.log('MEXC futures asset counts:', assetCounts);

        // Log the count of markets in each state
        const stateCounts = markets.reduce((acc, market) => {
            acc[market.state] = (acc[market.state] || 0) + 1;
            return acc;
        }, {});
        console.log('MEXC futures market state counts:', stateCounts);

        return { markets, assetCounts, quoteAssets };
    } catch (error) {
        console.error(`Error fetching MEXC futures markets:`, error);
        console.error('Error stack:', error.stack);
        return { markets: [], assetCounts: {}, quoteAssets: [] };
    }
}

export async function fetchAllSpotMarkets() {
    console.log('Fetching all MEXC spot markets...');
    const result = await fetchSpotMarkets(SPOT_API_URL);
    console.log(`MEXC spot markets fetched: ${result.markets.length}`);
    return result;
}

export async function fetchAllFuturesMarkets() {
    console.log('Fetching all MEXC futures markets...');
    const result = await fetchFuturesMarkets(FUTURES_API_URL);
    console.log(`MEXC futures markets fetched: ${result.markets.length}`);
    return result;
}
