const fetch = require('node-fetch');
const { fetchAllSpotMarkets: fetchMexcSpotMarkets, fetchAllFuturesMarkets: fetchMexcFuturesMarkets } = require('./fetchmexc');

const SPOT_API_URL = 'https://ascendex.com/api/pro/v1/cash/products';
const FUTURES_API_URL = 'https://ascendex.com/api/pro/v2/futures/contract';

async function fetchSpotMarkets() {
    try {
        console.log('Fetching AscendEX spot markets...');
        
        // Fetch both AscendEX and MEXC markets in parallel
        const [ascendexResponse, mexcResult] = await Promise.all([
            fetch(`/api/ascendex?url=${encodeURIComponent(SPOT_API_URL)}`),
            fetchMexcSpotMarkets()
        ]);
        
        if (!ascendexResponse.ok) {
            throw new Error(`HTTP error! status: ${ascendexResponse.status}`);
        }
        
        const data = await ascendexResponse.json();
        
        if (data.code !== 0) {
            throw new Error(`API returned error: ${data.msg || 'Unknown error'}`);
        }
        
        // Create a set of MEXC symbols for faster lookup
        const mexcSymbols = new Set(mexcResult.markets.map(market => {
            // Extract just the base and quote assets without the exchange prefix
            const baseQuote = market.symbol.replace('MEXC:', '').replace('.P', '');
            return baseQuote.toLowerCase();
        }));
        
        console.log(`Total MEXC spot symbols: ${mexcSymbols.size}`);
        
        // Filter out only Normal status products
        const activeProducts = data.data.filter(product => product.statusCode === 'Normal');
        console.log(`Total AscendEX spot markets: ${activeProducts.length}`);
        
        const allMarkets = activeProducts.map(product => {
            // Extract baseAsset and quoteAsset from symbol (e.g., "BTC/USDT")
            const [baseAsset, quoteAsset] = product.symbol.split('/');
            
            return {
                symbol: `MEXC:${baseAsset}${quoteAsset}`,
                baseAsset,
                quoteAsset,
                displayName: product.displayName,
                // Create a normalized symbol for comparison
                normalizedSymbol: `${baseAsset}${quoteAsset}`.toLowerCase()
            };
        });
        
        // Filter to only include markets that exist on MEXC
        const markets = allMarkets.filter(market => 
            mexcSymbols.has(market.normalizedSymbol)
        );
        
        console.log(`AscendEX spot markets after filtering (only those on MEXC): ${markets.length}`);
        
        if (markets.length > 0) {
            console.log('Sample AscendEX spot market:', markets[0]);
        }
        
        // Remove the normalizedSymbol property as it's no longer needed
        markets.forEach(market => delete market.normalizedSymbol);
        
        const quoteAssets = [...new Set(markets.map(market => market.quoteAsset))].sort();
        console.log('AscendEX spot quote assets:', quoteAssets);
        
        const assetCounts = quoteAssets.reduce((acc, asset) => {
            acc[asset] = markets.filter(market => market.quoteAsset === asset).length;
            return acc;
        }, {});
        console.log('AscendEX spot asset counts:', assetCounts);
        
        return { markets, assetCounts, quoteAssets };
    } catch (error) {
        console.error('Error fetching AscendEX spot markets:', error);
        console.error('Error stack:', error.stack);
        return { markets: [], assetCounts: {}, quoteAssets: [] };
    }
}

async function fetchFuturesMarkets() {
    try {
        console.log('Fetching AscendEX futures markets...');
        
        // Fetch both AscendEX and MEXC futures markets in parallel
        const [ascendexResponse, mexcResult] = await Promise.all([
            fetch(`/api/ascendex?url=${encodeURIComponent(FUTURES_API_URL)}`),
            fetchMexcFuturesMarkets()
        ]);
        
        if (!ascendexResponse.ok) {
            throw new Error(`HTTP error! status: ${ascendexResponse.status}`);
        }
        
        const data = await ascendexResponse.json();
        
        if (data.code !== 0) {
            throw new Error(`API returned error: ${data.msg || 'Unknown error'}`);
        }
        
        // Create a map of MEXC futures symbols with base and quote assets for better matching
        const mexcMarkets = mexcResult.markets.map(market => {
            // Extract base and quote assets
            return {
                symbol: market.symbol,
                baseAsset: market.baseAsset.toLowerCase(),
                quoteAsset: market.quoteAsset.toLowerCase()
            };
        });
        
        console.log(`Total MEXC futures symbols: ${mexcMarkets.length}`);
        
        // Filter out only Normal status contracts
        const activeContracts = data.data.filter(contract => contract.status === 'Normal');
        console.log(`Total AscendEX futures markets: ${activeContracts.length}`);
        
        const allMarkets = [];
        
        // Process each AscendEX contract
        for (const contract of activeContracts) {
            // Extract baseAsset from the underlying (e.g., "BTC/USDT")
            let baseAsset = '';
            let quoteAsset = '';
            
            if (contract.underlying) {
                const parts = contract.underlying.split('/');
                baseAsset = parts[0];
                // If underlying has quote asset, use it, otherwise use settlementAsset
                quoteAsset = parts.length > 1 ? parts[1] : contract.settlementAsset;
            } else {
                // Fallback to symbol parsing
                const symbolParts = contract.symbol.split('-');
                baseAsset = symbolParts[0];
                quoteAsset = contract.settlementAsset;
            }
            
            // Find matching MEXC markets based on base and quote assets
            const matchingMexcMarkets = mexcMarkets.filter(m => 
                m.baseAsset === baseAsset.toLowerCase() && 
                m.quoteAsset === quoteAsset.toLowerCase()
            );
            
            if (matchingMexcMarkets.length > 0) {
                // Use the first matching MEXC market's symbol format
                const matchingMarket = matchingMexcMarkets[0];
                allMarkets.push({
                    // Use the MEXC symbol format but keep our data
                    symbol: matchingMarket.symbol,
                    baseAsset,
                    quoteAsset,
                    displayName: contract.displayName
                });
            }
        }
        
        console.log(`AscendEX futures markets after matching with MEXC: ${allMarkets.length}`);
        
        if (allMarkets.length > 0) {
            console.log('Sample AscendEX futures market:', allMarkets[0]);
        }
        
        const quoteAssets = [...new Set(allMarkets.map(market => market.quoteAsset))].sort();
        console.log('AscendEX futures quote assets:', quoteAssets);
        
        const assetCounts = quoteAssets.reduce((acc, asset) => {
            acc[asset] = allMarkets.filter(market => market.quoteAsset === asset).length;
            return acc;
        }, {});
        console.log('AscendEX futures asset counts:', assetCounts);
        
        return { markets: allMarkets, assetCounts, quoteAssets };
    } catch (error) {
        console.error('Error fetching AscendEX futures markets:', error);
        console.error('Error stack:', error.stack);
        return { markets: [], assetCounts: {}, quoteAssets: [] };
    }
}

export async function fetchAllSpotMarkets() {
    console.log('Fetching all AscendEX spot markets...');
    const result = await fetchSpotMarkets();
    console.log(`AscendEX spot markets fetched: ${result.markets.length}`);
    return result;
}

export async function fetchAllFuturesMarkets() {
    console.log('Fetching all AscendEX futures markets...');
    const result = await fetchFuturesMarkets();
    console.log(`AscendEX futures markets fetched: ${result.markets.length}`);
    return result;
} 