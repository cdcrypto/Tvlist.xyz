import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  try {
    // Fetch the HTML content from the Breakout Prop symbols page
    const response = await fetch('https://www.breakoutprop.com/symbols/');
    const html = await response.text();
    
    // Parse the HTML using jsdom
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Find all symbol rows in the table
    const symbolRows = document.querySelectorAll('.table tbody tr');
    
    // Extract the symbols from the table
    const symbols = Array.from(symbolRows).map(row => {
      const symbolCell = row.querySelector('.symbol');
      return symbolCell ? symbolCell.textContent.trim() : null;
    }).filter(symbol => symbol !== null);
    
    // Format symbols for TradingView (BYBIT:SYMBOLUSDT.P)
    const formattedSymbols = symbols.map(symbol => {
      // Special cases for symbols that need different exchanges
      if (symbol === 'PEPE' || symbol === 'PEPEUSD') {
        return `OKX:PEPEUSDT.P`;
      }
      else if (symbol === 'NEIRO' || symbol === 'NEIROUSD') {
        return `BINANCE:NEIROUSDT.P`;
      }
      else if (symbol === 'SHIB' || symbol === 'SHIBUSD') {
        return `OKX:SHIBUSDT.P`;
      }
      else if (symbol === 'BONK' || symbol === 'BONKUSD') {
        return `OKX:BONKUSDT.P`;
      }
      // Handle special case for ETHBTC which doesn't end with USD
      else if (symbol === 'ETHBTC') {
        return `BYBIT:ETHBTC.P`;
      }
      // Handle special case for IOTA which doesn't have USD suffix
      else if (symbol === 'IOTA') {
        return `BYBIT:IOTAUSDT.P`;
      }
      // For all other symbols ending with USD, replace with USDT
      else if (symbol.endsWith('USD')) {
        return `BYBIT:${symbol.replace('USD', 'USDT')}.P`;
      }
      // For any other unexpected format, just add USDT
      else {
        return `BYBIT:${symbol}USDT.P`;
      }
    });
    
    // Join the formatted symbols with commas for TradingView watchlist
    const watchlist = formattedSymbols.join(',');
    
    // Return both the raw symbols and the formatted watchlist
    res.status(200).json({ 
      symbols,
      formattedSymbols,
      watchlist
    });
  } catch (error) {
    console.error('Error fetching symbols from Breakout Prop:', error);
    res.status(500).json({ error: 'Error fetching symbols from Breakout Prop' });
  }
} 