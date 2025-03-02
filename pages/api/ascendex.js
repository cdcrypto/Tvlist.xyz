import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from AscendEX:', error);
    res.status(500).json({ error: 'Error fetching data from AscendEX', details: error.message });
  }
} 