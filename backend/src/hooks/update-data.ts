import { HookContext } from '../declarations'
import axios from 'axios'
import { Products } from '../services/products/products.schema'
import pLimit from 'p-limit'

const typeKeywords = new Map([
  ['Energy', 'Single Cards'],
  ['Token', 'Single Cards'],
  ['Code Card', 'Single Cards'],
  ['Land', 'Single Cards'],
  ['Art Card', 'Single Cards'],
  ['Checklist Card', 'Single Cards'],
  ['Decklist Card', 'Single Cards'],
  ['Booster', 'Boosters'],
  ['Double Pack', 'Boosters'],
  ['VIP Edition Pack', 'Boosters'],
  ['Box Topper', 'Boosters'],
  ['Blister', 'Boosters'],
  ['Anniversary Edition Pack', 'Boosters'],
  ['Anniversary Edition Display', 'Boosters'],
  ['Jumpstart', 'Boosters'],
  ['VIP Edition', 'Boosters'],
  ['Mythic Edition', 'Boosters'],
  ['Deck', 'Decks'],
  ['Intro Pack', 'Decks'],
  ['Commander Collection', 'Decks'],
  ['Guild Kit', 'Decks'],
  ['Global Series', 'Decks'],
  ['Tournament Pack', 'Decks'],
  ['Commander', 'Decks'],
  ['SDCC', 'Promotion Cards'],
  ['Tournament Pack', 'Promotion Cards'],
  ['Promo Pack', 'Promotion Cards'],
  ['Promotional', 'Promotion Cards'],
  ['Box Set', 'Box Sets'],
  ['Game Night', 'Box Sets'],
  ['Scene Box', 'Box Sets'],
  ['Retail Tin', 'Tins'],
  ['Elite Trainer Box', 'Elite Trainer Boxes'],
  ['Build & Battle Box', 'Build & Battle Boxes'],
  ['Fat Pack', 'Bundles'],
  ['Bundle', 'Bundles'],
  ['Gift Bundle', 'Bundles'],
  ['Gift Box', 'Bundles'],
  ['Gift Pack', 'Bundles'],
  ['Gift Edition', 'Bundles'],
  ['Spindown', 'Spindown Dice'],
  ['Starter Set', 'Starter Kits'],
  ['Starter Kit', 'Starter Kits'],
  ['Clash Pack', 'Starter Kits'],
  ['Prerelease', 'Prerelease Packs'],
  ['Secret Lair', 'Secret Lair Drop']
])

// Main combined hook function
export const combinedHook = async (context: HookContext) => {
  console.time('Total Execution Time')
  console.log(`Running combined hook on ${context.path}.${context.method}`)

  console.time('fetchGames')
  await fetchGames(context)
  console.timeEnd('fetchGames')

  console.time('fetchSets')
  await fetchSets(context)
  console.timeEnd('fetchSets')

  console.time('processProductsAndPrices')
  await processProductsAndPrices(context)
  console.timeEnd('processProductsAndPrices')

  console.timeEnd('Total Execution Time')
}

// const fetchGames = async (context: HookContext) => {
//   console.log('fetching games')
//   const response = await axios.get(`https://tcgcsv.com/tcgplayer/categories`)
//   const games = response.data.results

//   for (const game of games) {
//     const existingGame = await context.app.service('games').find({
//       query: { 'external_id.tcgcsv_id': Number(game.categoryId) }
//     })

//     if (existingGame.total == 0 && ![21, 69, 70, 82].includes(Number(game.categoryId))) {
//       context.app.service('games').create({
//         name: game.displayName,
//         external_id: { tcgcsv_id: game.categoryId },
//         logo: `/assets/images/logos/${game.name}.png`
//       })
//     }
//   }
// }
const fetchGames = async (context: HookContext) => {
  console.log('fetching games')
  const response = await axios.get(`https://tcgcsv.com/tcgplayer/categories`)
  const games = response.data.results

  const existingGames = await context.app.service('games').find({ query: {}, paginate: false })
  const existingGameIds = new Set(existingGames.map((g: any) => g.external_id.tcgcsv_id))

  const newGames = games
    .filter(
      (game: any) =>
        !existingGameIds.has(Number(game.categoryId)) && ![21, 69, 70, 82].includes(Number(game.categoryId))
    )
    .map((game: any) => ({
      name: game.displayName,
      external_id: { tcgcsv_id: game.categoryId },
      logo: `/assets/images/logos/${game.name}.png`
    }))

  if (newGames.length > 0) {
    await context.app.service('games').create(newGames)
  }
}

// const fetchSets = async (context: HookContext) => {
//   console.log('fetching sets')
//   let startTime = Date.now()

//   try {
//     const gamesData = await context.app.service('games').find({ query: { $limit: 100000 } })
//     const games = gamesData.data

//     const groupPromises = games.map(async (game) => {
//       const externalId = game.external_id.tcgcsv_id
//       try {
//         const response = await axios.get(`https://tcgcsv.com/tcgplayer/${externalId}/groups`)
//         return { game, groups: response.data.results }
//       } catch (error) {
//         console.log(`Error fetching groups for externalId ${externalId}:`, error)
//         return { game, groups: [] }
//       }
//     })
//     console.time('API Calls - fetchSets')
//     const groupsData = await Promise.all(groupPromises)
//     console.timeEnd('API Calls - fetchSets')

//     console.time('Database Inserts - fetchSets')
//     const setPromises = groupsData.flatMap(({ game, groups }) =>
//       groups.map(async (group: any) => {
//         const existingSet = await context.app.service('sets').find({
//           query: { game_id: game._id, ['external_id.tcgcsv_id']: Number(group.groupId) }
//         })

//         if (existingSet.total === 0) {
//           await context.app.service('sets').create({
//             game_id: game._id,
//             name: group.name,
//             code: typeof group.abbreviation == 'string' ? (group.abbreviation as string) : '',
//             external_id: { tcgcsv_id: Number(group.groupId) }
//           })
//         } else if (existingSet.total === 1) {
//           if (typeof group.abbreviation == 'string') {
//             await context.app.service('sets').patch(existingSet.data[0]._id as string, {
//               code: group.abbreviation as string
//             })
//           }
//         }
//       })
//     )

//     await Promise.all(setPromises)
//     console.timeEnd('Database Inserts - fetchSets')
//   } catch (error) {
//     console.error('Error fetching games:', error)
//   }

//   console.log(`fetchSets completed in ${(Date.now() - startTime) / 1000} seconds`)
// }

const fetchSets = async (context: HookContext) => {
  console.log('fetching sets')

  const games = await context.app.service('games').find({ query: {}, paginate: false })

  const groupPromises = games.map(async (game) => {
    try {
      const response = await axios.get(`https://tcgcsv.com/tcgplayer/${game.external_id.tcgcsv_id}/groups`)
      return { game, groups: response.data.results }
    } catch (error) {
      console.log(`Error fetching groups for game ${game.external_id.tcgcsv_id}:`, error)
      return { game, groups: [] }
    }
  })

  const groupsData = await Promise.all(groupPromises)

  const allNewSets = []

  for (const { game, groups } of groupsData) {
    const existingSets = await context.app.service('sets').find({
      query: { game_id: game._id },
      paginate: false
    })

    const existingSetIds = new Set(existingSets.map((s: any) => s.external_id.tcgcsv_id))

    const newSets = groups
      .filter((group: any) => !existingSetIds.has(Number(group.groupId)))
      .map((group: any) => ({
        game_id: game._id,
        name: group.name,
        code: group.abbreviation || '',
        external_id: { tcgcsv_id: Number(group.groupId) }
      }))

    allNewSets.push(...newSets)
  }
  if (allNewSets.length > 0) {
    await context.app.service('sets').create(allNewSets)
  }
}

const parseNumberOrString = (input: string): number | string => {
  const parsedNumber = parseFloat(input)
  // Check if parsedNumber is a valid number
  if (isNaN(parsedNumber)) {
    // If parsing failed, return the original string
    return input
  }
  // If parsing succeeded, return the number
  return parsedNumber
}
const extractProductData = (foundProduct: FoundProduct): NewProduct => {
  const dataArray: any[] = []
  const newProduct: Partial<NewProduct> = {}
  const extendedDataMap = new Map<string, string>()

  if (foundProduct.extendedData) {
    for (const data of foundProduct.extendedData) {
      extendedDataMap.set(data.name, data.value)
      dataArray.push({
        name: data.name,
        display_name: data.displayName,
        value: data.value
      })
    }
  }

  newProduct.collector_number = extendedDataMap.get('Number') || ''
  newProduct.sort_number = parseNumberOrString(newProduct.collector_number) || newProduct.collector_number
  newProduct.rarity = extendedDataMap.get('Rarity') || ''
  newProduct.extended_data = dataArray

  newProduct.set_id = foundProduct.set_id
  newProduct.game_id = foundProduct.game_id
  newProduct.external_id = {
    tcgcsv_id: Number(foundProduct.productId),
    tcgcsv_category_id: Number(foundProduct.categoryId),
    tcgcsv_group_id: Number(foundProduct.groupId)
  }
  newProduct.short_name = `${foundProduct.name}`
  newProduct.name = `${foundProduct.name}`

  newProduct.image_url = `${foundProduct.imageUrl.slice(0, -8)}400w.jpg`
  newProduct.type = determineProductType(foundProduct, newProduct.rarity || '')

  newProduct.last_updated = Date.now()
  return newProduct as NewProduct
}

// export const processProductsAndPrices = async (context: HookContext) => {
//   console.log(`Running hook process-products-and-prices on ${context.path}.${context.method}`)
//   console.time('processProductsAndPrices Total Time')

//   const fetchProducts = async () => {
//     console.time('fetchProducts Total Time')
//     console.log('Starting product fetch')

//     try {
//       console.time('Database Query - Enabled Sets')
//       const enabledSetsData = await context.app.service('sets').find({ query: { $limit: 100000 } })
//       console.timeEnd('Database Query - Enabled Sets')

//       if (enabledSetsData.total === 0) {
//         console.log('no sets')
//         return
//       }

//       const enabledSets = enabledSetsData.data
//       const batchSize = 200 // Define the batch size
//       const limit = pLimit(5)
//       for (let i = 0; i < enabledSets.length; i += batchSize) {
//         console.log(
//           'processing batch ' +
//             (i + batchSize) / batchSize +
//             ' of ' +
//             Math.ceil(enabledSets.length / batchSize)
//         )
//         const batch = enabledSets.slice(i, i + batchSize)
//         console.time('API Calls - Fetch Products & Prices')

//         const productPromises = batch.map((set) =>
//           limit(async () => {
//             const gameId = await getExternalIdForGame(set.game_id.toString())

//             try {
//               const [productResponse, priceResponse] = await Promise.all([
//                 axios.get(`https://tcgcsv.com/tcgplayer/${gameId}/${set.external_id.tcgcsv_id}/products`),
//                 axios.get(`https://tcgcsv.com/tcgplayer/${gameId}/${set.external_id.tcgcsv_id}/prices`)
//               ])

//               const products = productResponse.data.results.map((v: any) => ({
//                 ...v,
//                 game_id: set.game_id,
//                 set_id: set._id,
//                 // set_name: set.name,
//                 anniversary: set.name.includes('Anniversary Tournament') ? true : false,
//                 pre_release:
//                   set.name.includes('Pre-Release') || set.name.includes('Prerelease') ? true : false,
//                 promo: set.name.match(/\bPromo\b/) || set.name.match(/\bPromos\b/) ? true : false
//               }))

//               const prices = priceResponse.data.results
//               return { products, prices }
//             } catch (axiosError) {
//               console.error(`Error fetching data for set ${set._id}:`, axiosError)
//               return { products: [], prices: [] }
//             }
//           })
//         )

//         const results = await Promise.all(productPromises)
//         console.timeEnd('API Calls - Fetch Products & Prices')
//         console.time('Processing Extracted Data')

//         const products = results.flatMap((result) => result.products)
//         const prices = results.flatMap((result) => result.prices)

//         if (products.length === 0 || prices.length === 0) continue

//         let numUpdated = 0
//         let numInserted = 0
//         console.time('Database Operations')

//         const productMap = new Map(products.map((product) => [product.productId, product]))

//         const bulkInsertProducts = []
//         const bulkInsertPrices = []
//         // const newProducts = []
//         // const newPrices = []

//         for (const price of prices) {
//           const foundProduct = productMap.get(price.productId)
//           if (!foundProduct) continue
//           const newProduct = extractProductData(foundProduct)

//           //  if (foundProduct.pre_release || foundProduct.anniversary){
//           //     console.log(foundProduct)

//           //   }

//           newProduct.name += foundProduct.pre_release ? ' Pre-Release Event' : ''
//           newProduct.name += foundProduct.anniversary ? ' Anniversary Event' : ''
//           newProduct.name += foundProduct.promo && newProduct.rarity !== 'Promo' ? ' Promo' : ''

//           let rarity = newProduct.rarity != undefined ? `, ${newProduct.rarity}` : ''

// if (
//   (newProduct.type === 'Single Cards' && !newProduct.name.includes('Code Card')) ||
//   newProduct.type === 'Presale' ||
//   newProduct.name.includes('Token')
// ) {
//   if (
//     newProduct.name.includes(removeLeadingZeros(newProduct.collector_number)) ||
//     newProduct.collector_number == undefined
//   ) {
//     newProduct.name += ` (${price.subTypeName}${rarity})`
//     // nameQuery = `(${price.subTypeName}, ${newProduct.rarity})`;
//   } else if (newProduct.collector_number != undefined) {
//     newProduct.name += ` - ${newProduct.collector_number} (${price.subTypeName}${rarity})`
//     //  nameQuery = `(${price.subTypeName}, ${newProduct.rarity})`;
//   } else {
//     // console.log(newProduct)
//   }
// }

//           const existingNameData = await context.app.service('products').find({
//             query: {
//               name: newProduct.name
//             }
//           })

//           if (existingNameData.total == 1) {
//             if (existingNameData.data[0].set_id.toString() != newProduct.set_id.toString()) {
//               const set = await context.app.service('sets').find({
//                 query: {
//                   _id: newProduct.set_id
//                 }
//               })
//               //  console.log(set)

//               let code =
//                 set.data[0].code == '' || set.data[0].code == undefined ? set.data[0].name : set.data[0].code
//               code = code === 'POP' ? set.data[0].name : code
//               newProduct.name += ` (${code})`
//             }
//           } else if (existingNameData.total > 1) {
//             //
//             // console.log(existingNameData.data)
//           }

//           const existingProductData = await context.app.service('products').find({
//             query: {
//               'external_id.tcgcsv_id': Number(newProduct.external_id.tcgcsv_id),
//               name: newProduct.name
//             }
//           })

//           // const settingsData = await context.app.service('settings').find()
//           // const settings = settingsData.data[0] || { tcgcsv_last_updated: 0 }

//           const newPrice: Price = {
//             market_price: price.marketPrice ? Number(price.marketPrice) : -1,
//             low_price: price.lowPrice ? Number(price.lowPrice) : -1,
//             mid_price: price.midPrice ? Number(price.midPrice) : -1,
//             high_price: price.highPrice ? Number(price.highPrice) : -1,
//             direct_low_price: price.directLowPrice ? Number(price.directLowPrice) : -1,
//             timestamp: Date.now()
//           }

//           if (existingProductData.total === 1) {
//             numUpdated++

//             const existingProduct = existingProductData.data[0] as Products
//             // console.log(existingProductData.data[0].name)

//             //   if (existingProduct.last_updated < settings.tcgcsv_last_updated) {
//             //  console.log('updating price')
//             await context.app
//               .service('prices')
//               .create({ ...newPrice, product_id: existingProductData.data[0]._id })
//             var _id = existingProduct._id as string
//             await context.app.service('products').patch(_id, {
//               name: newProduct.name,
//               last_updated: newProduct.last_updated,
//               market_price: newPrice.market_price,
//               low_price: newPrice.low_price,
//               high_price: newPrice.high_price,
//               mid_price: newPrice.mid_price,
//               direct_low_price: newPrice.direct_low_price,
//               type: newProduct.type
//             })

//             //  }
//           } else if (existingProductData.total > 1) {
//             // console.log('found too many')
//             //  console.log(existingProductData.data)
//           } else if (existingProductData.total === 0) {
//             numInserted++

//             //    console.log('no match')

//             newProduct.market_price = newPrice.market_price
//             newProduct.low_price = newPrice.low_price
//             newProduct.high_price = newPrice.high_price
//             newProduct.mid_price = newPrice.mid_price
//             newProduct.direct_low_price = newPrice.direct_low_price

//             await context.app
//               .service('products')
//               .create(newProduct)
//               .then(async (data) => {
//                 await context.app.service('prices').create({ ...newPrice, product_id: data._id })
//               })
//           }
//         }

//         console.log(
//           'done processing batch ' + (i + batchSize) / batchSize + ' of ' + enabledSets.length / batchSize
//         )
//         console.timeEnd('Database Operations')
//         console.timeEnd('Processing Extracted Data')
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error)
//     }

//     // console.log(`Done. Took ${(Date.now() - startTime) / 1000} seconds`)
//     console.timeEnd('fetchProducts Total Time')
//   }

//   const getExternalIdForGame = async (gameId: string) => {
//     let toReturn = null
//     await context.app
//       .service('games')
//       .find({
//         query: {
//           _id: gameId
//         }
//       })
//       .then((data) => {
//         if (data.data[0].external_id) {
//           toReturn = data.data[0].external_id.tcgcsv_id
//         }
//       })

//     return toReturn
//   }

//   fetchProducts()
//   console.timeEnd('processProductsAndPrices Total Time')
// }

// const determineProductType = (foundProduct: any, rarity: string) => {
//   const { extendedData, name, url } = foundProduct
//   const categoryId = foundProduct.categoryId || 0

//   const isPresale = foundProduct.presaleInfo.isPresale == true ? true : false;

//   if (isPresale) {
//     return 'Presale'
//   }

//   if (rarity !== '') {
//     return 'Single Cards'
//   }

//   const extendedName = extendedData.length > 0 ? extendedData[0].name : '' //kinda hacky.

//   if (extendedName.includes('Number')){
//     return 'Single Cards'
//   }

//   if (extendedName.includes('Token')) return 'Single Cards' //might not do anything

//   // Direct keyword checks for single card
//   if (
//     name.includes('Energy') ||
//     name.includes('Token') ||
//     name.includes('Code Card') ||
//     name.includes('Land') ||
//     name.includes('Art Card') ||
//     name.includes('Checklist Card') ||
//     name.includes('Decklist Card') ||
//     url.includes('art-series')
//   ) {
//     return 'Single Cards'
//   }

//   // Direct keyword checks for boosters
//   if (
//     name.includes('Booster') ||
//     name.includes('Double Pack') ||
//     name.includes('VIP Edition Pack') ||
//     name.includes('Box Topper') ||
//     name.includes('Blister') ||
//     name.includes('Anniversary Edition Pack') ||
//     name.includes('Anniversary Edition Display') ||
//     name.includes('Jumpstart') ||
//     name.includes('VIP Edition') ||
//     name.includes('Mythic Edition')
//   ) {
//     return 'Boosters'
//   }

//   if (name.includes('Commander')) {
//     const yearMatch = name.match(/Commander (\d{4})/)
//     if (yearMatch) return 'Decks'
//   }
//   // Direct keyword checks for decks
//   if (
//     name.includes('Deck') ||
//     name.includes('Intro Pack') ||
//     name.includes('Commander Collection') ||
//     name.includes('Guild Kit') ||
//     name.includes('Global Series') ||
//     (name.includes('Tournament Pack') && categoryId === 1) ||
//     (name.includes('Commander') && name.includes('Set of'))
//   ) {
//     return 'Decks'
//   }

//   if (name.includes('SDCC')) {
//     const yearMatch = name.match(/SDCC (\d{4})/)
//     if (yearMatch) return 'Promotion Cards'
//   }

//   if ((name.includes('Tournament Pack') && categoryId !== 1) || name.includes('Promo Pack') || name.includes('Promotional'))
//     return 'Promotion Cards'

//   // Direct keyword checks for other categories
//   if (name.includes('Box Set') || name.includes('Game Night') || name.includes('Scene Box'))
//     return 'Box Sets'

//   if (name.includes('Retail Tin')) return 'Tins'
//   if (name.includes('Elite Trainer Box')) return 'Elite Trainer Boxes'
//   if (name.includes('Build & Battle Box')) return 'Build & Battle Boxes'
//   if (
//     name.includes('Fat Pack') ||
//     name.includes('- Bundle') ||
//     name.includes('- Gift Bundle') ||
//     (name.includes('Gift Box') && categoryId === 1) ||
//     name.includes('Gift Pack') ||
//     name.includes('Gift Edition')
//   )
//     return 'Bundles'

//   if (name.includes('Spindown ')) {
//     return 'Spindown Dice'
//   }
//   if (name.includes('Starter Set') || name.includes('Starter Kit') || name.includes('Clash Pack'))
//     return 'Starter Kits'
//   if (name.includes('Prerelease')) return 'Prerelease Packs'
//   if (name.includes('Secret Lair')) return 'Secret Lair Drop'

//   // Check for rarity-based single card
//  // if (rarity) return 'Single Cards - Leak'

//   // Default case
//   return 'Sealed'
// }

const processProductsAndPrices = async (context: HookContext) => {
  console.log(`Running processProductsAndPrices on ${context.path}.${context.method}`)
  console.time('processProductsAndPrices Total Time')

  // Step 1: Fetch all sets and games in memory
  console.time('Initial Data Fetch')
  // Fetch sets, games, and existing products concurrently.
  const [sets, games, existingProducts] = await Promise.all([
    context.app.service('sets').find({ query: {}, paginate: false }),
    context.app.service('games').find({ query: {}, paginate: false }),
    context.app.service('products').find({ query: {}, paginate: false })
  ])
  console.timeEnd('Initial Data Fetch')

  // Build lookup maps for sets and games.
  const gameIdMap = new Map(games.map((game: any) => [game._id.toString(), game.external_id.tcgcsv_id]))
  const setMap = new Map(sets.map((set: any) => [set._id.toString(), set]))
  
  // --- Preload existing products ---
  // We update every product, so fetch all of them.


  // Build a map: key = product name, value = Map of external_id.tcgcsv_id → _id
  const existingProductsMap = new Map<string, Map<string, string>>()
  existingProducts.forEach((p: any) => {
    const name = p.name
    const extId = p.external_id?.tcgcsv_id?.toString()
    if (!name || !extId) return
    if (!existingProductsMap.has(name)) {
      existingProductsMap.set(name, new Map())
    }
    existingProductsMap.get(name)!.set(extId, p._id)
  })
  // --- End Preload ---

  // In-memory maps for products created in this run:
  // newProductsMap: key = product name, value = Map of external_id.tcgcsv_id → true
  const newProductsMap = new Map<string, Map<string, boolean>>()

  // Step 3: Fetch Products & Prices from API concurrently.
  let limit = pLimit(5) // Adjust concurrency as needed
  let batchSize = 200

  //Step 4: Fetch Products & Prices from API
  const productPromises = []

  for (let i = 0; i < sets.length; i += batchSize) {
    const batch = sets.slice(i, i + batchSize)

    productPromises.push(
      ...batch.map((set) =>
        limit(async () => {
          const gameId = gameIdMap.get(set.game_id.toString())
          if (!gameId) return { products: [], prices: [] }

          try {
            const [productResponse, priceResponse] = await Promise.all([
              axios.get(`https://tcgcsv.com/tcgplayer/${gameId}/${set.external_id.tcgcsv_id}/products`),
              axios.get(`https://tcgcsv.com/tcgplayer/${gameId}/${set.external_id.tcgcsv_id}/prices`)
            ])

            return {
              products: productResponse.data.results.map((p: any) => ({
                ...p,
                game_id: set.game_id,
                set_id: set._id,
                anniversary: set.name.includes('Anniversary Tournament') ? true : false,
                pre_release:
                  set.name.includes('Pre-Release') || set.name.includes('Prerelease') ? true : false,
                promo: set.name.match(/\bPromo\b/) || set.name.match(/\bPromos\b/) ? true : false,
                release: set.name.includes('Release Event') ? true : false
              })),
              prices: priceResponse.data.results
            }
          } catch (error) {
            console.error(`Error fetching data for set ${set._id}:`, error)
            return { products: [], prices: [] }
          }
        })
      )
    )
  }

  // Step 5: Await all API calls
  const results = await Promise.all(productPromises)
  const allProducts = results.flatMap((r) => r.products)
  const allPrices = results.flatMap((r) => r.prices)

  if (allProducts.length === 0 || allPrices.length === 0) return

  console.time('Processing Extracted Data')

  // Build a product map keyed by productId.
  const productMap = new Map<number, any>()
  for (const prod of allProducts) {
    productMap.set(prod.productId, prod)
  }

  const newProducts = []
  const updatedProducts = []

  // In-memory sets for this run:
  // newNames: Set of new product names added in this run.
  // newCompositeKeys: Set of composite keys ("name::tcgcsv_id") added in this run.

  // Main loop: Process each price entry.
  for (const price of allPrices) {
    const prod = productMap.get(price.productId)
    if (!prod) continue

    let newProduct = extractProductData(prod)

    // Build a local variable for the external id as a string.
    const extIdStr = newProduct.external_id.tcgcsv_id.toString();

    newProduct.name += prod.pre_release ? ' (Pre-Release Event)' : ''
    newProduct.name += prod.release ? ' (Release Event)' : ''
    newProduct.name += prod.anniversary ? ' (Anniversary Event)' : ''
    newProduct.name += prod.promo && newProduct.rarity !== 'Promo' ? ' (Promo)' : ''

    newProduct.market_price = price.marketPrice ? Number(price.marketPrice) : -1
    newProduct.low_price = price.lowPrice ? Number(price.lowPrice) : -1
    newProduct.mid_price = price.midPrice ? Number(price.midPrice) : -1
    newProduct.high_price = price.highPrice ? Number(price.highPrice) : -1
    newProduct.direct_low_price = price.directLowPrice ? Number(price.directLowPrice) : -1

    const rarityText = newProduct.rarity ? `, ${newProduct.rarity}` : ''
    if (
      (newProduct.type === 'Single Cards' && !newProduct.name.includes('Code Card')) ||
      newProduct.type === 'Presale' ||
      newProduct.name.includes('Token')
    ) {
      if (
        newProduct.collector_number === undefined ||
        newProduct.name.includes(removeLeadingZeros(newProduct.collector_number))
      ) {
        newProduct.name += ` (${price.subTypeName}${rarityText})`
      } else if (newProduct.collector_number !== undefined) {
        newProduct.name += ` - ${newProduct.collector_number} (${price.subTypeName}${rarityText})`
      }
    }

    const setData = setMap.get(newProduct.set_id.toString())
    if (setData && setData.name === 'The List Reprints' && !newProduct.name.includes('(LIST)')) {
      newProduct.name += ' (LIST)'
    }

    // --- STEP 1: Check if the name exists ---
    const nameExists = existingProductsMap.has(newProduct.name) || newProductsMap.has(newProduct.name)
    if (!nameExists) {
      // Name does not exist, so add a new product
      newProducts.push(newProduct)
      // Record in newProductsMap
      newProductsMap.set(newProduct.name, new Map([[extIdStr, true]]))
    } else {
      // --- STEP 2: Name exists; check composite key ---
      const extMapExisting = existingProductsMap.get(newProduct.name)
      const extMapNew = newProductsMap.get(newProduct.name)
      const compositeExists =
        (extMapExisting && extMapExisting.has(extIdStr)) ||
        (extMapNew && extMapNew.has(extIdStr))

      if (compositeExists) {
        //combination of name and tcgcsv exists, add to update list
        let existingId = extMapExisting!.get(extIdStr)

        updatedProducts.push({
          id: existingId!.toString(),
          data: {
            name: newProduct.name,
            type: newProduct.type,
            market_price: newProduct.market_price,
            low_price: newProduct.low_price,
            mid_price: newProduct.mid_price,
            high_price: newProduct.high_price,
            direct_low_price: newProduct.direct_low_price
          }
        })
      } else {
        // Step 3: Name exists but the composite key does not
        // Add set code
        if (setData) {
          let code = setData.code && setData.code !== '' ? setData.code : setData.name
          if (setData.name === 'The List Reprints') {
            code = ''
          }
          if (code === 'POP') {
            code = setData.name
          }
          newProduct.name += ` (${code})`

        }
        // Now, check again in the in-memory maps.
        const newCompositeExists =
          (existingProductsMap.has(newProduct.name) &&
            existingProductsMap.get(newProduct.name)!.has(extIdStr)) ||
          (newProductsMap.has(newProduct.name) &&
            newProductsMap.get(newProduct.name)!.has(extIdStr))

        if (newCompositeExists) {
                                // Now the composite exists => update.

          let existingId = existingProductsMap
            .get(newProduct.name)
            ?.get(extIdStr)

          updatedProducts.push({
            id: existingId!.toString(),
            data: {
              name: newProduct.name,
              type: newProduct.type,
              market_price: price.marketPrice ? Number(price.marketPrice) : -1,
              low_price: price.lowPrice ? Number(price.lowPrice) : -1,
              mid_price: price.midPrice ? Number(price.midPrice) : -1,
              high_price: price.highPrice ? Number(price.highPrice) : -1,
              direct_low_price: price.directLowPrice ? Number(price.directLowPrice) : -1
            }
          })
                    // Record the composite key in newProductsMap for consistency.

          if (!newProductsMap.has(newProduct.name)) {
            newProductsMap.set(newProduct.name, new Map())
          }
          newProductsMap.get(newProduct.name)!.set(extIdStr, true)
        } else {
                    // Composite still doesn't exist: add as new.

          newProducts.push(newProduct)
          if (!newProductsMap.has(newProduct.name)) {
            newProductsMap.set(newProduct.name, new Map())
          }
          newProductsMap.get(newProduct.name)!.set(extIdStr, true)
        }
      }
    }
  }

  console.time('Database Insert/Update')
  //Step 4: Bulk Insert New Products in batches
  batchSize = 5000
  limit = pLimit(5)
  const batches = []

  for (let i = 0; i < newProducts.length; i += batchSize) {
    batches.push(newProducts.slice(i, i + batchSize))
  }

  await Promise.all(batches.map((batch) => limit(() => context.app.service('products').create(batch))))

  // if (newProducts.length > 0) {
  //   await context.app.service('products').create(newProducts)
  // }
  // Step 5: Bulk Update Existing Products
  console.log('updating existing products')
  const patchPromises = updatedProducts.map(({ id, data }) =>
    limit(() => context.app.service('products').patch(id, data))
  )
  await Promise.all(patchPromises)
  console.log('done updating existing products')

  //step 6: bulk insert prices
  // removed for now

  console.timeEnd('Database Insert/Update')
  console.timeEnd('Processing Extracted Data')
  console.timeEnd('processProductsAndPrices Total Time')
}

const removeLeadingZeros = (str: string) => {
  if (str == undefined) {
    return 'undefined'
  }
  // Check if it contains a '/'
  if (str.includes('/')) {
    // Normalize both parts if there's a '/'
    const parts = str.split('/')
    return parts.map((part) => part.replace(/^0+/, '')).join('/')
  } else {
    // Otherwise just remove leading zeros from the single number
    return str.replace(/^0+/, '')
  }
}

const determineProductType = (foundProduct: any, rarity: string): string => {
  const { extendedData, name, url, categoryId } = foundProduct
  if (foundProduct.presaleInfo?.isPresale) return 'Presale'
  if (rarity !== '') return 'Single Cards'

  for (const [keyword, type] of typeKeywords) {
    if (name.includes(keyword)) return type
  }

  if (extendedData?.some((d: any) => d.name.includes('Number'))) return 'Single Cards'

  return 'Sealed' // Default fallback
}

interface ExtendedData {
  name: string
  displayName: string
  value: string
}

interface FoundProduct {
  extendedData?: ExtendedData[]
  set_id: string
  game_id: string
  productId: string
  categoryId: string
  groupId: string
  name: string
  imageUrl: string
}

interface NewProduct {
  pre_release?: boolean
  anniversary?: boolean
  release?: boolean
  promo?: boolean
  upc?: string
  text?: string
  collector_number?: any
  sort_number?: any
  rarity?: string
  sub_type?: string
  power?: string
  toughness?: string
  flavor_text?: string
  card_type?: string
  hp?: string
  stage?: string
  attack_1?: string
  attack_2?: string
  attack_3?: string
  attack_4?: string
  weakness?: string
  resistance?: string
  retreat_cost?: number
  colour?: string
  cost?: string
  life?: string
  counter?: string
  attribute?: string
  combo_power?: string
  property?: string
  ink_type?: string
  lore_value?: string
  set_id: string
  game_id: string
  external_id: {
    tcgcsv_id: number
    tcgcsv_category_id: number
    tcgcsv_group_id: number
  }
  name: string
  short_name: string
  image_url: string
  // buying: { enabled: boolean; quantity: number }
  //  selling: { enabled: boolean; quantity: number }
  type: string
  last_updated: number
  _id: string
  market_price: number
  low_price: number
  mid_price: number
  high_price: number
  direct_low_price: number

  attack?: number
  defense?: number
  monster_type?: string
  link_arrows?: string
  link_rating?: number
  shield?: number
  critical?: number
  unit?: string
  grade?: number
  race?: string
  nation?: string
  skill_icon?: string
  trigger?: string
  imaginary_gift?: string
  clan?: string
  rules_text?: string
  atk?: number
  def?: number
  total_cost?: number
  attribute_2?: string
  divinity?: number
  point_value?: number
  team?: string
  universe?: string
  rank?: string
  attacks?: number
  range?: number
  affiliation?: string
  energy_type?: string
  affiliation_2?: string
  max_dice?: number
  level?: number
  soul?: number
  trait: string
  trait_2: string
  triggers?: string
  element?: string
  job?: string
  category?: string
  gtin?: number
  sku?: string
  product_weight?: string
  dimensions?: string
  character_version?: string
  classification?: string
  promo_type?: string
  limit?: number
  team_name?: string
  LRIG_type_class?: string
  grow_cost?: string
  timing?: string
  class?: string
  traits?: string
  arena_type?: string
  aspect?: string
  move_cost?: string
  resource_cost?: string
  character_name?: string
  planet_name?: string
  location_name?: string
  extended_data?: ExtendedData[]
}

interface Price {
  product_id?: string | {}
  market_price: number
  low_price: number
  mid_price: number
  high_price: number
  direct_low_price: number
  timestamp: number
}

interface EnabledSet {
  game_id: string
  external_id: { tcgcsv_id: number }
  _id: string
}

interface ProductResponse {
  results: FoundProduct[]
}

interface PriceResponse {
  results: Price[]
}

interface Settings {
  tcgcsv_last_updated: Number
}

//if (
//   (newProduct.type === 'Single Cards' && !newProduct.name.includes('Code Card')) ||
//   (newProduct.type === 'Single Cards' &&
//     (!newProduct.name.includes('Art Card') || !newProduct.name.includes('Art Series'))) ||
//   newProduct.type === 'Single Cards - Leak' ||
//   newProduct.name.includes('Token')
// )
