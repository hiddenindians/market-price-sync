import client from '../services/client.js';
import { showDashboard, showLogin } from '../views/index.js';
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const getCredentials = () => {
  const user = {
    email: document.querySelector('[name="email"]').value,
    password: document.querySelector('[name="password"]').value
  };
  return user;
};

const login = async (credentials) => {

  try {
    if (!credentials) {
      // Try to authenticate using an existing token
      console.log('reauth')
      await client.reAuthenticate()
    } else {
      console.log('auth')

      // Otherwise log in with the `local` strategy using the credentials we got
      await client.authenticate({
        strategy: 'local',
        ...credentials
      })
    }

    // If successful, show the chat page
    showDashboard()
  } catch (error) {
    // If we got an error, show the login page
    showLogin(error)
  }
};

const setBuyListPercentage = (element) => {
  window.settings.buylist_percentage = element.value / 100;
};

const patchSellingQty = async (element) => {
  const quantity = Number(element.value);
  await client.service('products').patch(element.dataset.id, {
    selling: { quantity }
  });
};

const patchBuyingQty = async (element) => {
  const quantity = Number(element.value);
  await client.service('products').patch(element.dataset.id, {
    buying: { quantity }
  });
};

const importLightspeedCSV = () => {
  // Implementation for importing CSV
};

const fetchGames = async () => {
  client.service('fetch-games').create({})
};

const exportSellingBySet = async (id, limit, skip) => {
  // Implementation for exporting selling by set
};

const exportSellingByGame = async (id, limit, skip) => {
  // Implementation for exporting selling by game
};

const getExchangeRate = (price) => {
  // Implementation for getting exchange rate
};

const retailPrice = (price) => {
  // Implementation for calculating retail price
};

export {
  debounce,
  getCredentials,
  login,
  setBuyListPercentage,
  patchSellingQty,
  patchBuyingQty,
  importLightspeedCSV,
  fetchGames,
  exportSellingBySet,
  exportSellingByGame,
  getExchangeRate,
  retailPrice
};