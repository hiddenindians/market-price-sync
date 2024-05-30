
import client from './services/client.js';
import cacheExchangeRate from './services/exchangeRate.js';
import { showHeader, showLogin, showDashboard } from './views/index.js';

import { loginListener, showGamesListListener, homeListener}  from '../eventListeners/index.js'
import { login } from './utils/index.js';
loginListener(); showGamesListListener(); homeListener();

console.log('pop')

const initializeApp = async () => {
  await new Promise((resolve) => {
    const checkSettings = () => {
      if (window.settings) {
        resolve();
      } else {
        setTimeout(checkSettings, 50);
      }
    };
    checkSettings();
  });

  const userSettings = {
    theme: 'synthwave'
  };

  const CAD = await cacheExchangeRate();

  showHeader();
  login()

  
};

document.addEventListener('DOMContentLoaded', initializeApp);