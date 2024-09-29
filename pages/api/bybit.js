// bybit.js

import fetch from 'cross-fetch';

export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  console.log('Fetching URL:', url);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0', // Add a User-Agent header
        'Accept': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);

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
