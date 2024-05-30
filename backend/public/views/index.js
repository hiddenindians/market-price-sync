import { loginTemplate } from '../templates/login.mjs';
import { header } from '../templates/header.mjs';
import { dashboardTemplate } from '../templates/dashboard.mjs';
import { setListTemplate } from '../templates/set-list.mjs';
import { getEnabledGames, getAllGames, getAllSetsForGame, getProductsForGame, getProductsForSet } from '../services/client.js';

const showHeader = () => {
  document.body.insertAdjacentHTML('afterbegin', header);
};

const showLogin = () => {
  document.getElementById('app').innerHTML = loginTemplate();
};

const showDashboard = async () => {
  document.getElementById('app').innerHTML = dashboardTemplate();
  const container = document.getElementById('list');
  const tableHead = document.getElementById('table-head');
  tableHead.innerHTML += `
    <th scope='col' class='px-6 py-3'>Name</th>
    <th scope='col' class='px-6 py-3'>Manage Sets</th>
    <th scope='col' class='px-6 py-3'>Manage Products</th>`;
  const data = await getEnabledGames();
  const enabledGames = data.data;
  enabledGames.forEach((game) => {
    container.innerHTML += `
      <th scope='row'>
        <div class='flex items-center gap-3'>
          <div class='max-h-24 rounded'>
            <img class='max-h-16' src='${game.logo}' alt='${game.name}'/>
          </div>
          <div>
            <div class='font-bold'>${game.name}</div>
          </div>
        </div>
      </th>
      <td>
        <button data-id='${game._id}' class="show-set-list btn">Manage Sets</button>
      </td>
      <td>
        <button data-id='${game._id}' data-scope='game' class="show-product-list btn">Manage Products</button>
      </td>`;
  });
  paginate('game', null, data.total, data.limit, data.skip);
};

const showSettings = () => {
  document.getElementById('app').innerHTML = `
    <section>
      <label class="form-control">
        <div class="label">
          <span class="label-text">Adjust Buylist Percentage</span>
        <input id="buy-list-percentage" type="number" class="input" value="${window.settings.buylist_percentage * 100}" />
      </label>
    </section>
  `;
};

const showGameList = async (limit, skip) => {
  document.getElementById('app').innerHTML = setListTemplate;
  document.getElementById('search').dataset.scope = 'game';
  document.getElementById('table-head').innerHTML += `
    <th scope='col' class='px-6 py-3'>Enabled</th>
    <th scope='col' class='px-6 py-3'>Game</th>`;
  const data = await getAllGames(limit, skip);
  if (data.total !== 0) {
    data.data.forEach((game) => {
      document.getElementById('list').innerHTML += `
        <tr>
          <td>
            <input id="${game._id}" class="toggle toggle-success game-list-checkbox" type="checkbox" ${game.enabled ? 'checked' : ''}>
            <label for="${game._id}" class="sr-only">checkbox</label>
          </td>
          <th scope='row' class="px-6 py-4 font-medium whitespace-nowrap text-white">${game.name}</th>
        </tr>`;
    });
    paginate('games', null, data.total, data.limit, data.skip);
  }
};

const showSetList = async (gameId, limit, skip) => {
  document.getElementById('app').innerHTML = setListTemplate;
  document.getElementById('search').dataset.scope = 'set';
  document.getElementById('search').dataset.id = gameId;
  document.getElementById('table-head').innerHTML += `
    <th scope='col' class='px-6 py-3'>Enabled</th>
    <th scope='col' class='px-6 py-3'>Set Name</th>
    <th scope='col' class='px-6 py-3'>Manage Products</th>`;
  const data = await getAllSetsForGame(gameId, limit, skip);
  if (data.total !== 0) {
    data.data.forEach((set) => {
      document.getElementById('list').innerHTML += `
        <tr>
          <td>
            <input id="${set._id}" class="toggle toggle-success set-list-checkbox" type="checkbox" ${set.enabled ? 'checked' : ''}>
            <label for="${set._id}" class="sr-only">checkbox</label>
          </td>
          <th scope='row'>${set.name}</th>
          <td><button class="btn show-product-list" data-scope="set" data-id="${set._id}">Add/Remove Products</button></td>
        </tr>`;
    });
    paginate('set', gameId, data.total, data.limit, data.skip);
  }
};

const showProductList = async (scope, id, limit, skip) => {
  document.getElementById('list').innerHTML = '';
  document.getElementById('search').dataset.scope = scope;
  document.getElementById('search').dataset.id = id;
  document.getElementById('app').innerHTML =
    `<button class='export' data-scope=${scope} data-id=${id}>Download CSV</button>`;
  document.getElementById('app').innerHTML += setListTemplate;
  document.getElementById('table-head').innerHTML += `
    <th scope='col' class='px-6 py-3'>Selling</th>
    <th scope='col' class='px-6 py-3'>Qty. On Hand</th>
    <th scope='col' class='px-6 py-3'>Image</th>
    <th scope='col' class='px-6 py-3'>Product Name</th>
    <th scope='col' class='px-6 py-3'>Collector Number</th>
    <th scope='col' class='px-6 py-3'>Market Price</th>
    <th scope='col' class='px-6 py-3'>Retail Price</th>
    <th scope='col' class='px-6 py-3'>Buying</th>
    <th scope='col' class='px-6 py-3'>Buy Qty.</th>
    <th scope='col' class='px-6 py-3'>Buy List Price</th>
    <th scope='col' class='px-6 py-3'>Lightspeed System ID</th>`;
  const data =
    scope === 'game' ? await getProductsForGame(id, limit, skip) : await getProductsForSet(id, limit, skip);
  if (data.total !== 0) {
    data.data.forEach(showProduct);
    paginate(`products-for-${scope}`, id, data.total, data.limit, data.skip);
  }
};

const showProduct = (product) => {
  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  const marketPrice = Object.keys(product.market_price[0].market_price)[0];
  document.getElementById('list').innerHTML += `
    <tr>
      <td>
        <input id="${product._id}" class="toggle toggle-success selling-checkbox" type="checkbox" ${product.selling.enabled ? 'checked' : ''}>
        <label for="${product._id}" class="sr-only">checkbox</label>
      </td>
      <td>
        <input data-id="${product._id}" type="number" class="selling-qty-input w-24 input input-bordered input-md" value="${product.selling.quantity}" />
      </td>
      <td>
        <img class="max-h-24 hover:scale-[4] transition-all duration-500 cursor-pointer" src="${product.image_url.slice(6)}"/>
      </td>
      <th scope='row'>${product.name}</th>
      <td>${product.collector_number || ''}</td>
      <td>${USDollar.format(getExchangeRate(product.market_price[0].market_price[marketPrice]))}</td>
      <td>${USDollar.format(retailPrice(getExchangeRate(product.market_price[0].market_price[marketPrice])))}</td>
      <td>
        <input id="${product._id}" class="toggle toggle-success buying-checkbox" type="checkbox" ${product.buying.enabled ? 'checked' : ''}>
        <label for="${product._id}" class="sr-only">checkbox</label>
      </td>
      <td>
        <input data-id="${product._id}" type="number" class="buying-qty-input w-24 input input-bordered input-md" value="${product.buying.quantity}" />
      </td>
      <td>${USDollar.format(getExchangeRate(window.settings.buylist_percentage * product.market_price[0].market_price[marketPrice]))}</td>
      <td>${product.pos_id || 'N/A'}</td>
    </tr>`;
};

const showLargeChanges = (changes) => {
  document.getElementById('app').innerHTML = setListTemplate;
  document.getElementById('search').dataset.scope = 'game';
  document.getElementById('table-head').innerHTML += `
    <th scope='col' class='px-6 py-3'>Name</th>
    <th scope='col' class='px-6 py-3'>Old Price</th>
    <th scope='col' class='px-6 py-3'>New Price</th>
    <th scope='col' class='px-6 py-3'>% Change</th>`;
  changes.forEach((change) => {
    document.getElementById('list').innerHTML += `
      <tr>
        <th scope='row' class="px-6 py-4 font-medium whitespace-nowrap text-white">${change.Item}</th>
        <td>${change.Price}</td>
        <td>${change.new_price}</td>
        <td>${((change.new_price - change.MSRP) / change.MSRP) * 100}</td>
      </tr>`;
  });
};

const paginate = (scope, id, total, limit, skip) => {
  const currentSpan = document.querySelector('[data-id="paginate-current"]');
  const totalSpan = document.querySelector('[data-id="paginate-total"]');
  const pages = document.getElementById('pagination');
  const numPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  // Clear previous pagination
  currentSpan.innerHTML = '';
  totalSpan.innerHTML = '';
  pages.innerHTML = '';
  // Update current and total spans
  currentSpan.innerHTML = `${skip + 1} to ${Math.min(skip + limit, total)}`;
  totalSpan.innerHTML = `${total}`;
  // Add "First" and "Prev" buttons
  if (currentPage > 1) {
    pages.innerHTML += `
      <li>
        <button data-scope="${scope}" data-id="${id}" data-skip="0" class="paginate-button btn join-item">First</button>
      </li>
      <li>
        <button data-scope="${scope}" data-id="${id}" data-skip="${(currentPage - 2) * limit}" class="paginate-button btn join-item">Prev</button>
      </li>`;
  }
  // Add page number buttons
  for (let i = 1; i <= numPages; i++) {
    if (Math.abs(i - currentPage) < 3 || i < 6 || i > numPages - 5) {
      pages.innerHTML += `
        <li>
          <button data-skip="${(i - 1) * limit}" data-scope="${scope}" data-id="${id}" class="paginate-button join-item btn ${i === currentPage ? 'btn-active' : ''}">${i}</button>
        </li>`;
    }
  }
  // Add "Next" and "Last" buttons
  if (currentPage < numPages) {
    pages.innerHTML += `
      <li>
        <button data-id="${id}" data-scope="${scope}" data-skip="${currentPage * limit}" class="paginate-button btn join-item">Next</button>
      </li>
      <li>
        <button data-id="${id}" data-scope="${scope}" data-skip="${(numPages - 1) * limit}" class="paginate-button btn join-item">Last</button>
      </li>`;
  }
};

export { showHeader, showLogin, showDashboard, showSettings, showGameList, showSetList, showProductList, showProduct, showLargeChanges, paginate };
