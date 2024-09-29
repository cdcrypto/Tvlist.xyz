const fetch = require('node-fetch');

const SPOT_API_URL = '/api/kucoin?url=https://api.kucoin.com/api/v2/symbols';
const FUTURES_API_URL = '/api/kucoin?url=https://api-futures.kucoin.com/api/v1/contracts/active';

async function fetchMarkets(url, isSpot) {
    try {
        console.log(`Fetching ${isSpot ? 'spot' : 'futures'} markets from KuCoin...`);
        const response = await fetch(url);
        const data = await response.json();

        console.log('KuCoin API Response:', JSON.stringify(data, null, 2));

        let symbols = [];
        if (data.code !== "200000") {
            throw new Error(`API returned error: ${data.msg || data.message}`);
        }

        symbols = data.data;
        console.log(`Total symbols received: ${symbols.length}`);

        const markets = symbols
            .filter(symbol => {
                if (isSpot) {
                    return symbol.enableTrading === true;
                } else {
                    return symbol.status === 'Open';
                }
            })
            .map(symbol => {
                let formattedSymbol;
                if (isSpot) {
                    // Remove the '/' for spot markets
                    formattedSymbol = `KUCOIN:${symbol.symbol.replace('-', '')}`;
                } else {
                    // Remove the 'M' from futures markets
                    formattedSymbol = `KUCOIN:${symbol.symbol.replace('M', '')}.P`;
                }
                return {
                    symbol: formattedSymbol,
                    baseAsset: symbol.baseCurrency || symbol.baseCoin,
                    quoteAsset: symbol.quoteCurrency || symbol.quoteCoin
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
        console.error(`Error fetching ${isSpot ? 'spot' : 'futures'} markets from KuCoin:`, error);
        return { markets: [], assetCounts: {}, quoteAssets: [] };
    }
}

export async function fetchAllSpotMarkets() {
    console.log('Fetching KuCoin spot markets...');
    const result = await fetchMarkets(SPOT_API_URL, true);
    console.log('KuCoin spot markets fetched:', result.markets.length);
    return result;
}

export async function fetchAllFuturesMarkets() {
    console.log('Fetching KuCoin futures markets...');
    const result = await fetchMarkets(FUTURES_API_URL, false);
    console.log('KuCoin futures markets fetched:', result.markets.length);
    return result;
}
