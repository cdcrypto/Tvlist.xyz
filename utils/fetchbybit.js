const crypto = require('crypto');

const API_KEY = process.env.BYBIT_API_KEY;
const API_SECRET = process.env.BYBIT_API_SECRET;
const BASE_URL = 'https://api.bybit.com'; // Use the appropriate URL for your region

function generateSignature(timestamp, apiKey, recvWindow, queryString) {
  const stringToSign = `${timestamp}${apiKey}${recvWindow}${queryString}`;
  return crypto.createHmac('sha256', API_SECRET).update(stringToSign).digest('hex');
}

async function fetchWithAuth(endpoint, params) {
  const timestamp = Date.now().toString();
  const recvWindow = '5000';
  const queryString = new URLSearchParams(params).toString();
  const signature = generateSignature(timestamp, API_KEY, recvWindow, queryString);

  const url = `${BASE_URL}${endpoint}?${queryString}`;

  const response = await fetch(url, {
    headers: {
      'X-BAPI-API-KEY': API_KEY,
      'X-BAPI-TIMESTAMP': timestamp,
      'X-BAPI-RECV-WINDOW': recvWindow,
      'X-BAPI-SIGN': signature,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function fetchMarkets(category) {
  try {
    console.log(`Fetching ${category} markets from Bybit`);
    const url = `${BASE_URL}/v5/market/instruments-info?category=${category}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.retCode !== 0) {
      throw new Error(`API returned error: ${data.retMsg || 'Unknown error'}`);
    }

    const markets = data.result.list.map(instrument => ({
      symbol: `BYBIT:${instrument.symbol}${category === 'spot' ? '' : '.P'}`,
      baseAsset: instrument.baseCoin,
      quoteAsset: instrument.quoteCoin
    }));

    const quoteAssets = [...new Set(markets.map(market => market.quoteAsset))].sort();

    const assetCounts = quoteAssets.reduce((acc, asset) => {
      acc[asset] = markets.filter(market => market.quoteAsset === asset).length;
      return acc;
    }, {});

    return { markets, assetCounts, quoteAssets };
  } catch (error) {
    console.error(`Error fetching ${category} markets:`, error);
    throw error;
  }
}

export async function fetchAllSpotMarkets() {
  return fetchMarkets('spot');
}

export async function fetchAllFuturesMarkets() {
  return fetchMarkets('linear');
}
