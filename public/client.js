import { loginTemplate } from './templates/login.mjs'
import { header } from './templates/header.mjs'
import { dashboardTemplate } from './templates/dashboard.mjs'
import { setListTemplate } from './templates/set-list.mjs'

const socket = io()
const client = feathers()
client.configure(feathers.socketio(socket))
client.configure(feathers.authentication())

var settings = {
  limit: 10,
  skip: 0,
  buylist_percentage: 0.6,
  timeout: 500,
  tcgcsv_last_updated: 0
}

var userSettings = {
  theme: 'synthwave'
}

var timeout = null

const cacheExchangeRate = async () => {
  let toReturn = null
  await axios
    .get('https://openexchangerates.org/api/latest.json?app_id=3b0b937b4c3a4a5f8f8ecf074aa0b06e')
    .then((data) => {
      if (data.status == 200) {
        toReturn = data.data.rates.CAD
      }
    })
  return toReturn
}

const CAD = await cacheExchangeRate()

/////////////////////
/* Event Listeners */
/////////////////////
const addEventListener = (selector, event, handler) => {
  document.addEventListener(event, async (ev) => {
    if (ev.target.closest(selector)) {
      handler(ev)
    }
  })
}
// "Signup and login" button click handler
addEventListener('#signup', 'click', async () => {
  // For signup, create a new user and then log them in
  const credentials = getCredentials()

  // First create the user
  await client.service('users').create(credentials)
  // If successful log them in
  await login(credentials)
})
// "Login" button click handler
addEventListener('#login', 'click', async () => {
  const user = getCredentials()
  await login(user)
})

addEventListener('#toggle-drawer', 'click', async () => {
  var x = document.getElementById('drawer')
  if (x.style.display === 'none') {
    x.style.display = 'block'
  } else {
    x.style.display = 'none'
  }
})

addEventListener('#home', 'click', async (e) => {
  showDashboard()
})

// addEventListener('#search', 'change', (e) => {
//   clearTimeout(timeout)
//   timeout = setTimeout(function () {
//     search(e.srcElement.value, e.srcElement.dataset.scope, e.srcElement.dataset.id)
//   }, settings.timeout)
// })
addEventListener('.show-games-list', 'click', async (e) => {
  showGameList(settings.limit, e.srcElement.dataset.skip)
})

addEventListener('.show-set-list', 'click', async (e) => {
  showSetList(e.srcElement.dataset.id)
})

addEventListener('.show-product-list', 'click', async (e) => {
  showProductList(e.srcElement.dataset.scope, e.srcElement.dataset.id)
})

addEventListener('.update-data', 'click', async (e) => {
  document.getElementById('updating').toggleAttribute('hidden')
  await fetchGames()
  await fetchSets()
  await fetchProducts()
  document.getElementById('updating').toggleAttribute('hidden')
})

addEventListener('.set-list-checkbox', 'click', async (e) => {
  if (e.srcElement.checked) {
    client.service('sets').patch(e.srcElement.id, {
      enabled: true
    })
  } else {
    client.service('sets').patch(e.srcElement.id, {
      enabled: false
    })
  }
})

addEventListener('.game-list-checkbox', 'click', async (e) => {
  if (e.srcElement.checked) {
    client.service('games').patch(e.srcElement.id, {
      enabled: true
    })
  } else {
    client.service('games').patch(e.srcElement.id, {
      enabled: false
    })
  }
})

addEventListener('.selling-checkbox', 'click', async (e) => {
  if (e.srcElement.checked) {
    client.service('products').patch(e.srcElement.id, {
      selling: {
        enabled: true,
        quantity: Number(e.srcElement.closest('td').nextElementSibling.firstElementChild.value)
      }
    })
  } else {
    client.service('products').patch(e.srcElement.id, {
      selling: {
        enabled: false,
        quantity: Number(e.srcElement.closest('td').nextElementSibling.firstElementChild.value)
      }
    })
  }
})
addEventListener('.buying-checkbox', 'click', async (e) => {
  if (e.srcElement.checked) {
    client.service('products').patch(e.srcElement.id, {
      buying: {
        enabled: true,
        quantity: Number(e.srcElement.closest('td').nextElementSibling.firstElementChild.value)
      }
    })
  } else {
    client.service('products').patch(e.srcElement.id, {
      buying: {
        enabled: true,
        quantity: Number(e.srcElement.closest('td').nextElementSibling.firstElementChild.value)
      }
    })
  }
})
addEventListener('.paginate-button', 'click', async (e) => {
  let scope = e.srcElement.dataset.scope
  let id = e.srcElement.dataset.id
  let skip = e.srcElement.dataset.skip
  let limit = settings.limit

  if (scope === 'set') {
    showSetList(id, limit, skip)
  } else if (scope === 'games') {
    showGameList(limit, skip)
  } else if (scope === 'products-for-game') {
    showProductList('game', id, limit, skip)
  } else if (scope === 'products-for-set') {
    showProductList('set', id, limit, skip)
  }
})

addEventListener('#buy-list-percentage', 'change', (e) => {
  clearTimeout(timeout)

  timeout = setTimeout(function () {
    setBuyListPercentage(e.srcElement)
  }, settings.timeout)
})

addEventListener('.selling-qty-input', 'change', (e) => {
  clearTimeout(timeout)

  timeout = setTimeout(function () {
    patchSellingQty(e.srcElement)
  }, settings.timeout)
})
addEventListener('.buying-qty-input', 'change', (e) => {
  clearTimeout(timeout)

  timeout = setTimeout(function () {
    patchBuyingQty(e.srcElement)
  }, settings.timeout)
})
addEventListener('#import-csv', 'change', (e) => {
  importLightspeedCSV()
})

addEventListener('#settings', 'click', (e) => {
  showSettings()
})

addEventListener('.export', 'click', (e) => {
  if (e.srcElement.dataset.scope === 'set') {
    exportSellingBySet(e.srcElement.dataset.id, 5000, 0)
  } else if (e.srcElement.dataset.scope === 'game') {
    exportSellingByGame(e.srcElement.dataset.id, 5000, 0)
  }
})
///////////
/* Shows */
///////////

const showHeader = () => {
  document.getElementsByTagName('body')[0].insertAdjacentHTML('afterbegin', header)
}

const showLogin = () => {
  document.getElementById('app').innerHTML = loginTemplate()
}

const showDashboard = async () => {
  document.getElementById('app').innerHTML = dashboardTemplate()

  //populate game list
  let container = document.getElementById('list')
  let tableHead = document.getElementById('table-head')
  tableHead.innerHTML += `
    <th scope='col' class='px-6 py-3'>
        Name
    </th>
    <th scope='col' class='px-6 py-3'>
        Manage Sets
    </th>
    <th scope='col' class='px-6 py-3'>
        Manage Products
    </th>`

  await getEnabledGames().then((data) => {
    let enabledGames = data.data
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
            <button data-id='${game._id}' class="show-set-list btn">
                Manage Sets
            </button>
        </td>
        <td>
            <button data-id='${game._id}' data-scope='game' class="show-product-list btn">
                Manage Products
            </button>
       </td>
      `
    })

    paginate('game', null, data.total, data.limit, data.skip)
  })
}

const showSettings = () => {
  document.getElementById('app').innerHTML = `
    <section>
      <label class="form-control">
        <div class="label">
          <span class="label-text">Adjust Buylist Percentage</span>
        <input id="buy-list-percentage" type="number" class="input" value="${settings.buylist_percentage * 100}" />
      </label>
    </section>
  
  
  `
}

const showGameList = async (limit, skip) => {
  document.getElementById('app').innerHTML = setListTemplate
  document.getElementById('search').dataset.scope = 'game'
  document.getElementById('table-head').innerHTML += `
    <th scope='col' class='px-6 py-3'>
          Enabled
        </th>
        <th scope='col' class='px-6 py-3'>
          Game
        </th>
  `
  await getAllGames(limit, skip).then((data) => {
    if (data.total != 0) {
      console.log(data)
      for (var i = 0; i < data.data.length; i++) {
        document.getElementById('list').innerHTML += `<tr>
      <td>
        
          <input id="${data.data[i]._id}" class="toggle toggle-success game-list-checkbox" type="checkbox" ${data.data[i].enabled == true ? 'checked' : ''} >
          <label for="${data.data[i]._id}" class="sr-only">checkbox</label>
        
      </td>
      <th scope='row' class="px-6 py-4 font-medium whitespace-nowrap text-white">${data.data[i].name}</th>
    </tr>`
      }
      paginate('games', null, data.total, data.limit, data.skip)
    }
  })
}

const showSetList = async (gameId, limit, skip) => {
  document.getElementById('app').innerHTML = setListTemplate
  document.getElementById('search').dataset.scope = 'set'
  document.getElementById('search').dataset.id = gameId

  document.getElementById('table-head').innerHTML += `
    <th scope='col' class='px-6 py-3'>
          Enabled
        </th>
        <th scope='col' class='px-6 py-3'>
          Set Name
        </th>
        <th scope='col' class='px-6 py-3'>
        Manage Products
        </th>
  `

  await getAllSetsForGame(gameId, limit, skip).then((data) => {
    if (data.total != 0) {
      for (var i = 0; i < data.data.length; i++) {
        document.getElementById('list').innerHTML += `<tr>
          <td>
              <input id="${data.data[i]._id}" class="toggle toggle-success set-list-checkbox" type="checkbox" ${data.data[i].enabled == true ? 'checked' : ''}>
              <label for="${data.data[i]._id}" class="sr-only">checkbox</label>
          </td>
          <th scope='row'>${data.data[i].name}</th>
          <td ><button class="btn show-product-list" data-scope="set" data-id="${data.data[i]._id}">Add/Remove Products</button></td>
        </tr>`
      }

      paginate('set', gameId, data.total, data.limit, data.skip)
    }
  })
}

const showProductList = async (scope, id, limit, skip) => {
  console.log(`limit: ${limit}, skip: ${skip}`)
  document.getElementById('search').dataset.scope = scope
  document.getElementById('search').dataset.id = id

  document.getElementById('app').innerHTML =
    `<button class='export' data-scope=${scope} data-id=${id}>Download CSV</button>`
  document.getElementById('app').innerHTML += setListTemplate

  document.getElementById('table-head').innerHTML += `
    <th scope='col' class='px-6 py-3'>
      Selling
    </th>
    <th scope='col' class='px-6 py-3'>
      Qty. On Hand
    </th>
    <th scope='col' class='px-6 py-3'>
      Image
    </th>
    <th scope='col' class='px-6 py-3'>
      Product Name
    </th>
    <th scope='col' class='px-6 py-3'>
      Collector Number
    </th>
    <th scope='col' class='px-6 py-3'>
      Market Price
    </th>
    <th scope='col' class='px-6 py-3'>
      Retail Price
    </th>
    <th scope='col class='px-6 py-3'>
      Buying
    </th>
    <th scope='col' class='px-6 py-3'>
      Buy Qty.
    </th>
    <th scope='col' class='px-6 py-3'>
      Buy List Price
    </th>
    <th scope='col' class='px-6 py-3'>
      Lightspeed System ID
    </th>
  `
  if (scope === 'game') {
    await getProductsForGame(id, limit, skip).then((data) => {
      if (data.total != 0) {
        let products = data.data
        products.forEach((product) => {
          showProduct(product)
        })
      }

      paginate('products-for-game', id, data.total, data.limit, data.skip)
    })
  } else if (scope == 'set') {
    await getProductsForSet(id, limit, skip).then((data) => {
      if (data.total != 0) {
        let products = data.data
        products.forEach((product) => {
          showProduct(product)
        })
      }
      paginate('products-for-set', id, data.total, data.limit, data.skip)
    })
  }
}

const showProduct = (product) => {
  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })
  console.log(settings.buylist_percentage)
  let marketPrice = Object.keys(product.market_price[0].market_price)[0]
  document.getElementById('list').innerHTML += `
                    <tr>

                        <td>
                            <input id="${product._id}" class="toggle toggle-success selling-checkbox" type="checkbox" ${product.selling.enabled == true ? 'checked' : ''}>
                            <label for="${product._id}" class="sr-only">checkbox</label>
                        </td>
                        <td>
                            <input data-id="${product._id}" type="number" class="selling-qty-input w-24 input input-bordered input-md" value="${product.selling.quantity}" />
                        </td>
                        <td>
                            <img class="max-h-24 hover:scale-[4] transition-all duration-500 cursor-pointer" src="${product.image_url.slice(6)}"/>
                        </td>
                        <th scope='row'>
                            ${product.name} 
                        </th>
                        <td> 
                        ${product.collector_number ? product.collector_number : ''}
                    </td>
                        <td>${USDollar.format(getExchangeRate(product.market_price[0].market_price[marketPrice]))} </td>
                        <td> ${USDollar.format(retailPrice(getExchangeRate(product.market_price[0].market_price[marketPrice])))} </td>

                        <td>
                            <input id="${product._id}" class="toggle toggle-success buying-checkbox" type="checkbox" ${product.buying.enabled == true ? 'checked' : ''}>
                            <label for="${product._id}" class="sr-only">checkbox</label> 
                        </td>
                        <td>
                        <input data-id="${product._id}" type="number" class="buying-qty-input w-24 input input-bordered input-md" value="${product.buying.quantity}" />
                    </td>
                        <td>${USDollar.format(getExchangeRate(settings.buylist_percentage * product.market_price[0].market_price[marketPrice]))} </td>
                        <td>${product.pos_id ? product.pos_id : 'N/A'} </td>
                       
                    </tr>`

  // <td>$${(product.marketPrice.normal) ? product.marketPrice.normal : (product.marketPrice.foil) ? product.marketPrice.foil : (product.marketPrice.reverseFoil) ? product.marketPrice.reverseFoil : ""} </td>
}

// const showSearchResults = (results) => {
//   document.getElementById('list').innerHTML = ""
//   if(results.length > 0) {
//     results.forEach(result => {
//       document.getElementById('list').innerHTML += "

//       "
//     })
//   }
// }
// const search = async (input, scope, id) => {
//   let service;
//   let query;
//   if (scope === 'game') {
//     service = 'games'
//     query = {
//       name: { $regex: input, $options: 'i' }
//     }
//   } else if ((scope === 'set')) {
//     service = 'sets'
//     query = {
//       name: { $regex: input, $options: 'i' }
//     }
//   } else if ((scope === 'products-for-game')) {
//     service = 'products'
//     query = {
//       name: { $regex: input, $options: 'i' },
//       game_id: id
//     }
//   } else if ((scope === 'products-for-set')) {
//     service = products,
//     query = {
//       name: { $regex: input, $options: 'i' },
//       set_id: id
//     }
//   }
// console.log(service)
//   await client
//     .service(service)
//     .find({
//       query
//     })
//     .then((data) => {
//       showSearchResults(data.data, scope)
//     })
// }
const paginate = (scope, id, total, limit, skip) => {
  let counter = 1 + skip
  let currentSpan = document.querySelector('[data-id="paginate-current"]')
  let totalSpan = document.querySelector('[data-id="paginate-total"]')
  let pages = document.getElementById('pagination')
  let numPages = Math.ceil(total / limit)
  let currentPage

  skip / limit > 0 ? (currentPage = skip / limit + 1) : (currentPage = 1)

  console.log(`currentpage ${currentPage}, numpages: ${numPages}`)

  if (counter === total) {
    currentSpan.innerHTML += `${counter}`
  } else if (total < limit || counter + limit + 1 > total) {
    currentSpan.innerHTML += `${counter} to ${total}`
  } else {
    currentSpan.innerHTML += `${counter} to ${counter + limit - 1}`
  }
  totalSpan.innerHTML += `${total}`

  if (currentPage > 1) {
    pages.innerHTML += `
        <li>
        <button data-scope=${scope} data-id='${id}' data-skip='0' class="paginate-button btn join-item">First</button>

        </li>
        
        <li>
        <button data-scope=${scope} data-id='${id}' data-skip='${(currentPage - 2) * limit}' class="paginate-button btn join-item">Prev</button>
      </li>`
  }

  for (var i = 1; i <= numPages; i++) {
    // var li = document.createElement('li');
    // var button = document.createElement('button')
    // button.dataset.id = id;
    // button.dataset.skip = (i-1)* limit
    // button.className = "paginate-button join-item btn"
    if (currentPage > 3) {
      if (i >= currentPage + 3) {
      } else if (i <= currentPage - 3) {
      } else if (i == currentPage) {
        pages.innerHTML += `
            <li><button data-skip='${(i - 1) * limit}' data-scope=${scope} data-id='${id}' class="btn-active paginate-button join-item btn">${i}</button></li>

            `
      } else {
        pages.innerHTML += `
            <li><button data-skip='${(i - 1) * limit}' data-scope=${scope} data-id='${id}' class="paginate-button join-item btn">${i}</button></li>

            `
      }
    } else {
      if (numPages < 5) {
        pages.innerHTML += `
            <li><button data-skip='${(i - 1) * limit}' data-scope=${scope} data-id='${id}' class="paginate-button join-item btn">${i}</button></li>

            `
      } else {
        if (i < 6) {
          if (i == currentPage) {
            pages.innerHTML += `
            <li><button data-skip='${(i - 1) * limit}' data-scope=${scope} data-id='${id}' class="btn-active paginate-button join-item btn">${i}</button></li>

            `
          } else {
            pages.innerHTML += `
            <li><button data-skip='${(i - 1) * limit}' data-scope=${scope} data-id='${id}' class="paginate-button join-item btn">${i}</button></li>

            `
          }
        }
      }
    }
  }

  if (total > limit) {
    pages.innerHTML += `

    <li>
        <button data-id='${id}' data-scope=${scope} data-skip='${currentPage * limit}' class="paginate-button btn join-item">Next</a>
    </li>
    <li>
        <button data-id='${id}' data-scope=${scope} data-skip='${(numPages - 1) * limit}' class="paginate-button btn join-item">Last</a>
    </li>
    
    `
  }
}

/////////////
/* Fetches */
/////////////
const fetchGames = async () => {
  await axios.get(`https://tcgcsv.com/categories`).then(async (data) => {
    let d = data.data.results
    for (var i = 0; i < d.length; i++) {
      await client
        .service('games')
        .find({
          query: {
            external_id: {
              tcgcsv_id: d[i].categoryId
            }
          }
        })
        .then((data) => {
          if (data.total == 0) {
            client.service('games').create({
              name: d[i].displayName,
              external_id: {
                tcgcsv_id: d[i].categoryId
              },
              logo: `/assets/images/logos/${d[i].name}.png`
            })
          }
        })
    }
  })
}

const fetchSets = async () => {
  await getEnabledGames().then(async (data) => {
    if (data.total != 0) {
      let results = data.data
      results.forEach(async (result) => {
        let externalId = result.external_id.tcgcsv_id
        await axios.get(`https://tcgcsv.com/${externalId}/groups`).then(async (data) => {
          let d = data.data.results
          for (var i = 0; i < d.length; i++) {
            await client
              .service('sets')
              .find({
                query: {
                  game_id: result._id,
                  name: d[i].name
                }
              })
              .then(async (data) => {
                if (data.total == 0) {
                  client.service('sets').create({
                    game_id: result._id, //fixme
                    name: d[i].name,
                    external_id: {
                      tcgcsv_id: d[i].groupId
                    }
                  })
                }
              })
          }
        })
      })
    }
  })
}

const fetchProducts = async () => {
  await getEnabledSets().then(async (data) => {
    if (data.total != 0) {
      var sets = data.data

      for (var i = 0; i < sets.length; i++) {
        await getExternalIdForGame(sets[i].game_id).then(async (gameId) => {
          let set = sets[i]
          await axios
            .get(`https://tcgcsv.com/${gameId}/${set.external_id.tcgcsv_id}/products`)
            //create products
            .then(async (data) => {
              console.log(sets)

              var prices
              await axios
                .get(`https://tcgcsv.com/${gameId}/${set.external_id.tcgcsv_id}/prices`)
                .then((data) => {
                  if (data.data.totalItems != 0) {
                    prices = data.data.results
                  }
                })

              if (prices.length != 0 && data.data.totalItems != 0) {
                let results = data.data.results

                for (var i = 0; i < prices.length; i++) {
                  for (var j = 0; j < results.length; j++) {
                    if (prices[i].productId === results[j].productId) {
                      let product = {}
                      let price = {}
                      if (results[j].extendedData) {
                        for (var k = 0; k < results[j].extendedData.length; k++) {
                          switch (results[j].extendedData[k].name) {
                            case 'UPC':
                              product.upc = results[j].extendedData[k].value
                              break
                            //Universal
                            case 'CardText':
                              product.text = results[j].extendedData[k].value
                              break
                            case 'Number':
                              product.collector_number = results[j].extendedData[k].value
                              break
                            case 'Rarity':
                              product.rarity = results[j].extendedData[k].value
                              break
                            //MTG
                            case 'SubType':
                              product.sub_type = results[j].extendedData[k].value
                              break
                            case 'P':
                              product.power = results[j].extendedData[k].value
                              break
                            case 'T':
                              product.toughness = results[j].extendedData[k].value
                              break
                            case 'OracleText':
                              product.text = results[j].extendedData[k].value
                              break
                            case 'FlavorText':
                              product.flavor_text = results[j].extendedData[k].value
                              break
                            //Pokemon
                            case 'Card Type':
                              product.card_type = results[j].extendedData[k].value
                              break
                            case 'HP':
                              product.hp = results[j].extendedData[k].value
                              break
                            case 'Stage':
                              product.stage = results[j].extendedData[k].value
                              break
                            case 'Attack 1':
                              product.attack_1 = results[j].extendedData[k].value
                              break
                            case 'Attack 2':
                              product.attack_2 = results[j].extendedData[k].value
                              break
                            case 'Attack 3':
                              product.attack_3 = results[j].extendedData[k].value
                              break
                            case 'Attack 4':
                              product.attack_4 = results[j].extendedData[k].value
                              break
                            case 'Weakness':
                              product.weakness = results[j].extendedData[k].value
                              break
                            case 'Resistance':
                              product.resistance = results[j].extendedData[k].value
                              break
                            case 'Retreat Cost':
                              product.retreat_cost = results[j].extendedData[k].value
                              break
                            //One Piece / DBS FW
                            case 'Description':
                              product.text = results[j].extendedData[k].value
                              break
                            case 'Color':
                              product.colour = results[j].extendedData[k].value
                              break
                            case 'Cost':
                              product.cost = results[j].extendedData[k].value
                              break
                            case 'CardType':
                              product.card_type = results[j].extendedData[k].value
                              break
                            case 'Life': //one piece only
                              product.life = results[j].extendedData[k].value
                              break
                            case 'Counterplus': //one piece only
                              product.counter = results[j].extendedData[k].value
                              break
                            case 'Power':
                              product.power = results[j].extendedData[k].value
                              break
                            case 'SubTypes':
                              product.sub_type = results[j].extendedData[k].value
                              break
                            case 'Attribute':
                              product.attribute = results[j].extendedData[k].value
                              break
                            case 'Combo Power': //DBS Only
                              product.combo_power = results[j].extendedData[k].value
                              break
                            case 'Character Traits': //DBS only
                              product.sub_type = results[j].extendedData[k].value
                              break
                            // Lorcana
                            case 'Property':
                              product.property = results[j].extendedData[k].value
                              break
                            case 'Cost Ink':
                              product.cost = results[j].extendedData[k].value
                              break
                            case 'Character Version':
                              product.character_version = results[j].extendedData[k].value
                              break
                            case 'InkType':
                              product.ink_type = results[j].extendedData[k].value
                              break
                            case 'Strength':
                              product.power = results[j].extendedData[k].value
                              break
                            case 'Willpower':
                              product.toughness = results[j].extendedData[k].value
                              break
                            case 'Lore Value':
                              product.lore_value = results[j].extendedData[k].value
                              break
                            case 'Flavor Text':
                              product.flavor_text = results[j].extendedData[k].value
                              break
                          }
                        }
                      } else {
                        console.log(results[j])
                      }
                      product.set_id = set._id
                      product.game_id = set.game_id
                      product.external_id = {}
                      product.external_id.tcgcsv_id = results[j].productId
                      product.name = `${results[j].name}`
                      product.image_url = `${results[j].imageUrl.slice(0, -8)}400w.jpg`
                      product.buying = {
                        enabled: false,
                        quantity: 0
                      }
                      product.selling = {
                        enabled: false,
                        quantity: 0
                      }

                      if (results[j].extendedData.length <= 2) {
                        if (results[j].extendedData.name && results[j].extendedData.name.includes('Token')) {
                          product.type = 'Single Cards'
                        } else if (results[j].name.includes('Code Card')) {
                          product.type = 'Single Cards'
                        } else if (results[j].name.includes('Booster')) {
                          product.type = 'Boosters'
                        } else if (results[j].name.includes('Deck')) {
                          product.type = 'Decks'
                        } else if (results[j].name.includes('Elite Trainer Box')) {
                          product.type = 'Elite Trainer Boxes'
                        } else if (results[j].name.includes('Double Pack')) {
                          product.type = 'Boosters'
                        } else if (results[j].name.includes('Build & Battle Box')) {
                          product.type = 'Build & Battle Boxes'
                        } else if (results[j].name.includes('Blister')) {
                          product.type = 'Boosters'
                        } else {
                          product.type = 'sealed'
                        }
                      } else {
                        product.type = 'Single Cards'
                      }

                      if (product.type === 'Single Cards' && !product.name.includes('Code Card')) {
                        if (results[j].name.includes(product.collector_number)) {
                          product.name += ` (${prices[i].subTypeName}, ${product.rarity})`
                        } else {
                          product.name += ` - ${product.collector_number} (${prices[i].subTypeName}, ${product.rarity})`
                        }
                      }

                      if (prices[i].productId === results[j].productId) {
                        if (prices[i].marketPrice) {
                          price.market_price = {
                            [prices[i].subTypeName]: Number(prices[i].marketPrice)
                          }
                        } else {
                          price.market_price = {
                            [prices[i].subTypeName]: Number(prices[i].midPrice)
                          }
                        }

                        product.last_updated = Date.now()

                        await client
                          .service('products')
                          .find({
                            query: {
                              name: `${product.name}`,
                              external_id: {
                                tcgcsv_id: results[j].productId
                              }
                            }
                          })
                          .then(async (data) => {
                            if (data.total === 0) {
                              console.log('no match')
                              await client
                                .service('products')
                                .create(product)
                                .then(async (data) => {
                                  if (data._id) {
                                    price.timestamp = Date.now()

                                    price.product_id = data._id
                                    await client.service('prices').create(price)
                                  }
                                })
                            } else if (
                              data.total != 0 &&
                              data.data[0].last_updated < settings.tcgcsv_last_updated
                            ) {
                              price.timestamp = Date.now()
                              price.product_id = data.data[0]._id
                              await client.service('prices').create(price)
                            }
                          })
                      }
                    }
                  }
                }
              }
            })
        })
      }
    }
  })
}

const fetchTCGCSVLastUpdated = async () => {
  let latest
  await axios.get('https://tcgcsv.com/last-updated.txt').then((data) => {
    latest = new Date(data.data) / 1000
  })
  settings.tcgcsv_last_updated = latest
  setSettings()
}

// const fetchPrices = async (game, set) => {

//     await getEnabledSets().then(async data => {
//         if (data.total != 0) {
//             var sets = data.data;

//             sets.forEach(async set => {

//                 await getExternalIdForGame(set.game_id).then(async data => {
//                     var game = data;
//                     await axios.get(`https://tcgcsv.com/${game}/${set.external_id.tcgcsv_id}/prices`).then(async (data) => {
//                         let results = data.data.results

//                         if (results.length != 0) {
//                             for (var i = 0; i < results.length; i++) {
//                                 await client
//                                     .service('products')
//                                     .find({
//                                         query: {
//                                             external_id: {
//                                                 tcgcsv_id: results[i].productId
//                                             }
//                                         }
//                                     })
//                                     .then(async (data) => {
//                                         if (data.total != 0) {
//                                             let otherPrints;
//                                             if (data.data[0].marketPrice) {
//                                                 otherPrints = data.data[0].marketPrice
//                                             } else {
//                                                 otherPrints = {}
//                                             }

//                                             if (results[i].subTypeName == 'Foil' || results[i].subTypeName == 'Holofoil') {
//                                                 if (!results[i].marketPrice) {
//                                                     otherPrints.foil = Number(results[i].midPrice.toString())
//                                                     await client.service('products').patch(data.data[0]._id, {
//                                                         marketPrice: otherPrints
//                                                     })
//                                                 } else {
//                                                     otherPrints.foil = Number(results[i].marketPrice.toString())

//                                                     await client.service('products').patch(data.data[0]._id, {
//                                                         marketPrice: otherPrints
//                                                     })
//                                                 }
//                                             }

//                                             if (results[i].subTypeName == 'Reverse Holofoil') {
//                                                 if (!results[i].marketPrice) {
//                                                     otherPrints.reverseFoil = Number(results[i].midPrice.toString())

//                                                     await client.service('products').patch(data.data[0]._id, {
//                                                         marketPrice: otherPrints
//                                                     })
//                                                 } else {
//                                                     otherPrints.reverseFoil = Number(results[i].marketPrice.toString())

//                                                     await client.service('products').patch(data.data[0]._id, {
//                                                         marketPrice: otherPrints
//                                                     })
//                                                 }
//                                             }
//                                             if (results[i].subTypeName == 'Normal') {

//                                                 if (!results[i].marketPrice) {
//                                                     otherPrints.normal = Number(results[i].midPrice.toString())

//                                                     await client.service('products').patch(data.data[0]._id, {
//                                                         marketPrice: otherPrints
//                                                     })
//                                                 } else {
//                                                     otherPrints.normal = Number(results[i].marketPrice.toString())

//                                                     await client.service('products').patch(data.data[0]._id, {
//                                                         marketPrice: otherPrints
//                                                     })
//                                                 }
//                                             }
//                                         }
//                                         document.getElementById('updating').style.display = 'none';

//                                     })
//                             }
//                         }
//                     })
//                 })
//             })
//         }
//     })
// }

//////////
/* Gets */
//////////
const getProductsForGame = async (gameId, limit, skip) => {
  let toReturn = null
  await client
    .service('products')
    .find({
      query: {
        game_id: gameId,
        $sort: {
          collector_number: 1
        },
        $limit: limit,
        $skip: skip
      }
    })
    .then((data) => {
      console.log(data.data)
      toReturn = data
    })

  return toReturn
}

const getProductsForSet = async (setId, limit, skip) => {
  let toReturn = null

  await client
    .service('products')
    .find({
      query: {
        set_id: setId,
        $sort: {
          collector_number: 1
        },
        $limit: limit,
        $skip: skip
      }
    })
    .then((data) => {
      toReturn = data
    })

  return toReturn
}

const getSellingForSet = async (setId, limit, skip) => {
  let toReturn = null

  await client
    .service('products')
    .find({
      query: {
        set_id: setId,
        'selling.enabled': true,
        'selling.quantity': { $gte: 0 },
        $limit: limit,
        $skip: skip,
        $sort: {
          collector_number: 1
        }
      }
    })
    .then((data) => {
      toReturn = data
    })

  return toReturn
}
const getSellingForGame = async (gameId, limit, skip) => {
  let toReturn = null

  await client
    .service('products')
    .find({
      query: {
        game_id: gameId,
        'selling.enabled': true,
        'selling.quantity': { $gte: 0 },
        $limit: limit,
        $skip: skip,
        $sort: {
          collector_number: 1
        }
      }
    })
    .then((data) => {
      toReturn = data
    })

  return toReturn
}

const getEnabledGames = async () => {
  let toReturn = null
  await client
    .service('games')
    .find({
      query: {
        enabled: true
      }
    })
    .then((data) => {
      toReturn = data
    })
  return toReturn
}

const getExternalIdForGame = async (gameId) => {
  let toReturn = null
  await client
    .service('games')
    .find({
      query: {
        _id: gameId
      }
    })
    .then((data) => {
      if (data.data[0].external_id) {
        toReturn = data.data[0].external_id.tcgcsv_id
      }
    })

  return toReturn
}

const getEnabledSets = async () => {
  let toReturn = null
  await client
    .service('sets')
    .find({
      query: {
        enabled: true
      }
    })
    .then((data) => {
      toReturn = data
    })
  return toReturn
}
const getAllGames = async (limit, skip) => {
  let toReturn = null
  await client
    .service('games')
    .find({
      query: {
        $sort: {
          external_id: 1
        },
        $limit: limit,
        $skip: skip
      }
    })
    .then((data) => {
      toReturn = data
    })

  return toReturn
}

const getAllSetsForGame = async (gameId, limit, skip) => {
  let toReturn = null

  await client
    .service('sets')
    .find({
      query: {
        game_id: gameId,
        $sort: {
          external_id: -1
        },
        $limit: limit,
        $skip: skip
      }
    })
    .then((data) => {
      toReturn = data
    })

  return toReturn
}

const getGameNameFromId = async (gameId) => {
  let toReturn = null

  await client
    .service('games')
    .find({
      query: {
        _id: gameId
      }
    })
    .then((data) => {
      if (data.total != 0) {
        toReturn = data.data[0].name
      }
    })
  return toReturn
}

const getSetNameFromId = async (setId) => {
  let toReturn = null

  await client
    .service('sets')
    .find({
      query: {
        _id: setId
      }
    })
    .then((data) => {
      if (data.total != 0) {
        toReturn = data.data[0].name
      }
    })
  return toReturn
}

const getExchangeRate = (price) => {
  return price * CAD
}

const getCredentials = () => {
  const user = {
    email: document.querySelector('[name="email"]').value,
    password: document.querySelector('[name="password"]').value
  }
  return user
}

const getSettings = async () => {
  if (settings._id) {
    await client
      .service('settings')
      .find({
        query: {
          _id: settings._id
        }
      })
      .then((data) => {})
  } else {
    console.log(settings)
    setSettings()
  }
}
//////////
/* Sets */
//////////

const setBuyListPercentage = (e) => {
  settings.buylist_percentage = e.value / 100
  saveSettings()
}

const setSettings = async () => {
  if (settings._id) {
    await client.service('settings').update(settings._id, settings)
  } else {
    await client
      .service('settings')
      .create(settings)
      .then((result) => {
        settings._id = result._id
        console.log(settings)
      })
  }
}

///////////
/* Patch */
///////////

const patchSellingQty = async (e) => {
  let id = e.dataset.id
  let qty = e.value

  await client
    .service('products')
    .patch(id, {
      selling: {
        enabled: true,
        quantity: Number(qty)
      }
    })
    .then((data) => {
      e.classList.add('input-success')
      e.closest('tr').firstElementChild.firstElementChild.checked = true
      setTimeout(() => {
        e.classList.remove('input-success')
      }, 2500)
    })
}
const patchBuyingQty = async (e) => {
  let id = e.dataset.id
  let qty = e.value

  await client
    .service('products')
    .patch(id, {
      buying: {
        enabled: true,
        quantity: Number(qty)
      }
    })
    .then((data) => {
      e.classList.add('input-success')
      e.closest('td').previousElementSibling.firstElementChild.checked = true
      setTimeout(() => {
        e.classList.remove('input-success')
      }, 2500)
    })
}

/////////////
/* Exports */
/////////////

const exportSellingBySet = async (setId, limit, skip) => {
  await getSellingForSet(setId, limit, skip).then(async (data) => {
    if (data.total != 0) {
      var products = data.data

      var jsonArray = await Promise.all(
        products.map(async (product) => {
          let object = {}
          let marketPrice = Object.keys(product.market_price[0].market_price)[0]
          object.description = product.name
          object.quantity = product.selling.quantity
          object.default_price = retailPrice(
            getExchangeRate(product.market_price[0].market_price[marketPrice])
          )
          object.msrp = retailPrice(getExchangeRate(product.market_price[0].market_price[marketPrice]))
          object.online_price = retailPrice(
            getExchangeRate(product.market_price[0].market_price[marketPrice])
          )
          object.category = 'Trading Card Games'

          await getGameNameFromId(product.game_id).then((data) => {
            object.subcategory1 = data
          })

          object.subcategory2 = product.type

          if (product.type == 'Single Cards') {
            await getSetNameFromId(product.set_id).then((data) => {
              object.subcategory3 = data
            })
          }

          object.enabled_on_eCom = 'yes'
          object.image = product.image_url.slice(-15)
          object.image_URL = product.image_url
          return object
        })
      )

      var csv = Papa.unparse(jsonArray)
      downloadBlob(csv, 'tcg_prices.csv', 'text/csv;charset=utf-8')
    }
  })
}
const exportSellingByGame = async (gameId, limit, skip) => {
  await getSellingForGame(gameId, limit, skip).then(async (data) => {
    if (data.total != 0) {
      var products = data.data

      var jsonArray = await Promise.all(
        products.map(async (product) => {
          let object = {}
          let marketPrice = Object.keys(product.market_price[0].market_price)[0]
          object.description = product.name
          object.quantity = product.selling.quantity
          object.default_price = retailPrice(
            getExchangeRate(product.market_price[0].market_price[marketPrice])
          )
          object.msrp = retailPrice(getExchangeRate(product.market_price[0].market_price[marketPrice]))
          object.online_price = retailPrice(
            getExchangeRate(product.market_price[0].market_price[marketPrice])
          )
          object.category = 'Trading Card Games'

          await getGameNameFromId(product.game_id).then((data) => {
            object.subcategory1 = data
          })

          object.subcategory2 = product.type

          if (product.type == 'Single Cards') {
            await getSetNameFromId(product.set_id).then((data) => {
              object.subcategory3 = data
            })
          }

          object.enabled_on_eCom = 'yes'
          object.image = product.image_url.slice(-15)
          object.image_URL = product.image_url
          return object
        })
      )

      var csv = Papa.unparse(jsonArray)
      downloadBlob(csv, 'tcg_prices.csv', 'text/csv;charset=utf-8')
    }
  })
}

const exportAllProducts = () => {}

const exportAllProductsForGame = (gameId, limit, skip) => {}

const downloadBlob = (content, filename, contentType) => {
  // Create a blob
  var blob = new Blob([content], { type: contentType })
  var url = URL.createObjectURL(blob)

  // Create a link to download it
  var pom = document.createElement('a')
  pom.href = url
  pom.setAttribute('download', filename)
  pom.click()
}

const retailPrice = (price) => {
  if (price <= 0.25) {
    return 0.25
  } else if (price > 0.25 && price <= 0.35) {
    return 0.35
  } else if (price > 0.35 && price <= 0.5) {
    return 0.5
  } else if (price > 0.5) {
    return price
  }
}

const importLightspeedCSV = () => {
  var bigFile = document.getElementById('import-csv').files[0]
  var noMatch = []
  Papa.parse(bigFile, {
    header: true,
    complete: async function (results) {
      var products = results.data

      await Promise.all(
        products.map(async (product) => {
          await client
            .service('products')
            .find({
              query: {
                pos_id: product['System ID']
              }
            })
            .then(async (data) => {
              if (data.total == 1) {
                await client.service('products').patch(data.data[0]._id, {
                  pos_id: product['System ID'],
                  average_cost: product.avg_cost ? product.avg_cost : 0,
                  'selling.enabled': true,
                  'selling.quantity': product['Qty.']
                })
              } else {
                await client
                  .service('products')
                  .find({
                    query: {
                      name: product.Item
                    }
                  })
                  .then(async (data) => {
                    if (data.total != 0) {
                      await client.service('products').patch(data.data[0]._id, {
                        pos_id: product['System ID'],
                        average_cost: product.avg_cost ? product.avg_cost : 0,
                        'selling.enabled': true,
                        'selling.quantity': product['Qty.']
                      })
                    } else {
                      noMatch.push(product)
                    }
                  })
              }
            })
        })
      )
    }
  })

  console.log(noMatch)
}

// Log in either using the given email/password or the token from storage
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
}

const applyTheme = () => {
  document.documentElement.dataset.theme = userSettings.theme
}

login()
applyTheme()
showHeader()
fetchGames()
getSettings()
await fetchTCGCSVLastUpdated()
setSettings()
