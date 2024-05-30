import client from '../services/client.js';
import { getCredentials, login, debounce, setBuyListPercentage, patchSellingQty, patchBuyingQty, importLightspeedCSV, fetchGames, exportSellingBySet, exportSellingByGame } from '../utils/index.js';
import { showDashboard, showGameList, showSetList, showProductList, showSettings } from '../views/index.js';

const addEventListener = (selector, event, handler) => {
  document.addEventListener(event, async (ev) => {
    if (ev.target.closest(selector)) {
      handler(ev);
    }
  });
};

export const signupListener = () => {
  addEventListener('#signup', 'click', async () => {
    const credentials = getCredentials();
    await client.service('users').create(credentials);
    await login(credentials);
  });
};

export const loginListener = () => {
  addEventListener('#login', 'click', async () => {
    const user = getCredentials();
    await login(user);
  });
};

export const toggleDrawerListener = () => {
  addEventListener('#toggle-drawer', 'click', async () => {
    const drawer = document.getElementById('drawer');
    drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
  });
};

export const homeListener = () => {
  addEventListener('#home', 'click', () => showDashboard());
};

export const showGamesListListener = () => {
  addEventListener('.show-games-list', 'click', async (e) => {
    showGameList(settings.limit, e.target.dataset.skip);
  });
};

export const showSetListListener = () => {
  addEventListener('.show-set-list', 'click', async (e) => {
    showSetList(e.target.dataset.id);
  });
};

export const showProductListListener = () => {
  addEventListener('.show-product-list', 'click', async (e) => {
    showProductList(e.target.dataset.scope, e.target.dataset.id, settings.limit);
  });
};

export const updateDataListener = () => {
  addEventListener('.update-data', 'click', async (e) => {
    const startTime = Date.now();
    const updatingElement = document.getElementById('updating');
    updatingElement.toggleAttribute('hidden');
    await fetchGames();
    updatingElement.toggleAttribute('hidden');
    console.log(`Done Updating. It took ${(Date.now() - startTime) / 1000} seconds`);
  });
};

export const setListCheckboxListener = () => {
  addEventListener('.set-list-checkbox', 'click', async (e) => {
    const enabled = e.target.checked;
    await client.service('sets').patch(e.target.id, { enabled });
  });
};

export const gameListCheckboxListener = () => {
  addEventListener('.game-list-checkbox', 'click', async (e) => {
    const enabled = e.target.checked;
    await client.service('games').patch(e.target.id, { enabled });
  });
};

export const sellingCheckboxListener = () => {
  addEventListener('.selling-checkbox', 'click', async (e) => {
    const enabled = e.target.checked;
    const quantity = Number(e.target.closest('td').nextElementSibling.firstElementChild.value);
    await client.service('products').patch(e.target.id, {
      selling: { enabled, quantity }
    });
  });
};

export const buyingCheckboxListener = () => {
  addEventListener('.buying-checkbox', 'click', async (e) => {
    const enabled = e.target.checked;
    const quantity = Number(e.target.closest('td').nextElementSibling.firstElementChild.value);
    await client.service('products').patch(e.target.id, {
      buying: { enabled, quantity }
    });
  });
};

export const paginateButtonListener = () => {
  addEventListener('.paginate-button', 'click', async (e) => {
    const { scope, id, skip } = e.target.dataset;
    const limit = 10;
    if (scope === 'set') {
      showSetList(id, limit, skip);
    } else if (scope === 'games') {
      showGameList(limit, skip);
    } else if (scope === 'products-for-game') {
      showProductList('game', id, limit, skip);
    } else if (scope === 'products-for-set') {
      showProductList('set', id, limit, skip);
    }
  });
};

export const buyListPercentageListener = () => {
  addEventListener(
    '#buy-list-percentage',
    'change',
    debounce((e) => {
      setBuyListPercentage(e.target);
    }, settings.timeout)
  );
};

export const sellingQtyInputListener = () => {
  addEventListener(
    '.selling-qty-input',
    'change',
    debounce((e) => {
      patchSellingQty(e.target);
    }, settings.timeout)
  );
};

export const buyingQtyInputListener = () => {
  addEventListener(
    '.buying-qty-input',
    'change',
    debounce((e) => {
      patchBuyingQty(e.target);
    }, settings.timeout)
  );
};

export const importCsvListener = () => {
  addEventListener('#import-csv', 'change', () => {
    importLightspeedCSV();
  });
};

export const settingsListener = () => {
  addEventListener('#settings', 'click', () => {
    showSettings();
  });
};

export const exportListener = () => {
  addEventListener('.export', 'click', (e) => {
    const { scope, id } = e.target.dataset;
    if (scope === 'set') {
      exportSellingBySet(id, 5000, 0);
    } else if (scope === 'game') {
      exportSellingByGame(id, 5000, 0);
    }
  });
};