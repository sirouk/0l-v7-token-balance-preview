// pages/api/fetchVitals.js
export const runtime = 'edge';

export default async (req, res) => {
    try {
      const response = await fetch('https://0lexplorer.io/api/webmonitor/vitals');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(error.status || 500).json({
        error: error.message || 'Internal Server Error'
      });
    }
  };
  