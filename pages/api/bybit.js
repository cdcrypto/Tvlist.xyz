import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { category } = req.query;
  
  if (!category || (category !== 'spot' && category !== 'linear')) {
    return res.status(400).json({ error: 'Invalid category parameter' });
  }

  const url = `https://api.bybit.com/v5/market/instruments-info?category=${category}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from Bybit:', error);
    res.status(500).json({ 
      error: 'Error fetching data from Bybit',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
