import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  console.log('Fetching URL:', url);

  try {
    const response = await fetch(url);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    console.log('Response text:', text);

    const data = JSON.parse(text);
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