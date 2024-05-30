//import axios from 'axios';

const cacheExchangeRate = async () => {
  try {
    const response = await axios.get(
      'https://openexchangerates.org/api/latest.json?app_id=3b0b937b4c3a4a5f8f8ecf074aa0b06e'
    );
    if (response.status === 200) {
      return response.data.rates.CAD;
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
  }
  return null;
};

export default cacheExchangeRate;