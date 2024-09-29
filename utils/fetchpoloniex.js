const fetch = require('node-fetch');
const crypto = require('crypto');

// Replace these with your actual API key and secret
const API_KEY = process.env.POLONIEX_API_KEY;
const API_SECRET = process.env.POLONIEX_API_SECRET;

const SPOT_API_URL = '/api/poloniex?url=https://api.poloniex.com/markets';
const FUTURES_API_URL = 'https://api.poloniex.com/v3/market/instruments'; // Note the full URL

async function fetchMarkets(url, isSpot) {
    try {
        let response, data;
        if (isSpot) {
            response = await fetch(url);
            data = await response.json();
        } else {
            // Futures API requires authentication
            const method = 'GET';
            const path = '/v3/market/instruments';
            const timestamp = Date.now().toString();
            const params = { signTimestamp: timestamp };

            // Generate the signature
            const signature = generateSignature(method, path, params, API_SECRET);

            const headers = {
                key: API_KEY,
                signTimestamp: timestamp,
                signatureMethod: 'HmacSHA256',
                signatureVersion: '2',
                signature: signature
            };

            // Construct the full URL with query parameters
            const queryParams = new URLSearchParams(params).toString();
            const fullUrl = `${url}?${queryParams}`;

            response = await fetch(fullUrl, {
                method: method,
                headers: headers
            });

            data = await response.json();
        }

        let markets = [];

        if (isSpot) {
            // For spot markets, data is an array of market objects
            markets = data
                .filter(market => market.state === "NORMAL")
                .map(market => {
                    const baseAsset = market.baseCurrencyName;
                    const quoteAsset = market.quoteCurrencyName;
                    return {
                        symbol: `POLONIEX:${baseAsset}${quoteAsset}`,
                        baseAsset,
                        quoteAsset
                    };
                });
        } else {
            // For futures markets, data is an array of instruments
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format received from the API');
            }
            markets = data
                .filter(instrument => instrument.status === "TRADING")
                .map(instrument => {
                    const baseAsset = instrument.baseCurrency;
                    const quoteAsset = instrument.quoteCurrency;
                    return {
                        symbol: `POLONIEX:${instrument.symbol}`,
                        baseAsset,
                        quoteAsset
                    };
                });
        }

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

function generateSignature(method, path, params, secretKey) {
    // Sort the parameters alphabetically by ASCII order
    const sortedParams = Object.keys(params).sort().map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');

    const requestString = `${method}\n${path}\n${sortedParams}`;

    // Create HmacSHA256 hash
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(requestString);
    const hash = hmac.digest(); // Returns Buffer

    // Encode the hash in base64
    const signature = hash.toString('base64');

    return signature;
}

export async function fetchAllSpotMarkets() {
    return fetchMarkets(SPOT_API_URL, true);
}

// Remove the fetchAllFuturesMarkets function
