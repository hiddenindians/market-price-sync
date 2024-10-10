import { HookContext } from '../declarations'
import axios from 'axios'
import { Products } from '../services/products/products.schema'
import pLimit from 'p-limit'

const attributes: any[] = []

// Main combined hook function
export const combinedHook = async (context: HookContext) => {
  ;`Running combined hook on ${context.path}.${context.method}`

  await fetchGames(context)
  await fetchSets(context)
  await processProductsAndPrices(context)
}

const fetchGames = async (context: HookContext) => {
  console.log('fetching games')
  const response = await axios.get(`https://tcgcsv.com/categories`)
  const games = response.data.results

  for (const game of games) {
    const existingGame = await context.app.service('games').find({
      query: { 'external_id.tcgcsv_id': game.categoryId }
    })

    if (existingGame.total == 0 && ![21, 69, 70, 82].includes(Number(game.categoryId))) {
      context.app.service('games').create({
        name: game.displayName,
        external_id: { tcgcsv_id: game.categoryId },
        logo: `/assets/images/logos/${game.name}.png`
      })
    }
  }
}

const fetchSets = async (context: HookContext) => {
  console.log('fetching sets')
  let startTime = Date.now()

  try {
    const gamesData = await context.app.service('games').find({ query: { $limit: 100000 } })
    const games = gamesData.data

    const groupPromises = games.map(async (game) => {
      const externalId = game.external_id.tcgcsv_id
      try {
        const response = await axios.get(`https://tcgcsv.com/${externalId}/groups`)
        return { game, groups: response.data.results }
      } catch (error) {
        console.log(`Error fetching groups for externalId ${externalId}:`, error)
        return { game, groups: [] }
      }
    })
    const groupsData = await Promise.all(groupPromises)
    const setPromises = groupsData.flatMap(({ game, groups }) =>
      groups.map(async (group: any) => {
        const existingSet = await context.app.service('sets').find({
          query: { game_id: game._id, ['external_id.tcgcsv_id']: group.groupId }
        })

        if (existingSet.total === 0) {
          await context.app.service('sets').create({
            game_id: game._id,
            name: group.name,
            code: group.abbreviation,
            external_id: { tcgcsv_id: group.groupId }
          })
        } else if (existingSet.total === 1) {
          await context.app.service('sets').patch(existingSet.data[0]._id as string ,{
            code: group.abbreviation as string
          })
        }
      })
    )

    await Promise.all(setPromises)
  } catch (error) {
    console.error('Error fetching games:', error)
  }

  console.log(`Done. It took ${(Date.now() - startTime) / 1000} seconds`)
}

export const processProductsAndPrices = async (context: HookContext) => {
  console.log(`Running hook process-products-and-prices on ${context.path}.${context.method}`)

  const getExternalIdForGame = async (gameId: string) => {
    let toReturn = null
    await context.app
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
    if (foundProduct.extendedData) {
      for (var i = 0; i < foundProduct.extendedData.length; i++) {
        let toPush = {
          name: foundProduct.extendedData[i].name,
          display_name: foundProduct.extendedData[i].displayName,
          value: foundProduct.extendedData[i].value
        }
        if (foundProduct.extendedData[i].name === 'Number') {
          newProduct.collector_number = foundProduct.extendedData[i].value
          newProduct.sort_number = parseNumberOrString(foundProduct.extendedData[i].value)
        }
        if (foundProduct.extendedData[i].name === 'Rarity') {
          newProduct.rarity = foundProduct.extendedData[i].value
        }
        dataArray.push(toPush)
      }
      newProduct.extended_data = dataArray
    } else {
      // console.log(foundProduct)
    }

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
    // newProduct.buying = { enabled: false, quantity: 0 }
    //   newProduct.selling = { enabled: false, quantity: 0 }
    newProduct.type = determineProductType(foundProduct, newProduct.rarity || '')

    newProduct.last_updated = Date.now()

    return newProduct as NewProduct
  }
  const fetchProducts = async () => {
    const startTime = Date.now()
    console.log('starting')

    try {
      const enabledSetsData = await context.app.service('sets').find({ query: { $limit: 100000 } })
      if (enabledSetsData.total === 0) {
        console.log('no sets')
        return
      }

      const enabledSets = enabledSetsData.data
      const batchSize = 200 // Define the batch size
      const limit = pLimit(20)
      for (let i = 0; i < enabledSets.length; i += batchSize) {
        console.log(
          'processing batch ' +
            (i + batchSize) / batchSize +
            ' of ' +
            Math.ceil(enabledSets.length / batchSize)
        )
        const batch = enabledSets.slice(i, i + batchSize)

        const productPromises = batch.map((set) =>
          limit(async () => {
            const gameId = await getExternalIdForGame(set.game_id.toString())

            try {
              const [productResponse, priceResponse] = await Promise.all([
                axios.get(`https://tcgcsv.com/${gameId}/${set.external_id.tcgcsv_id}/products`),
                axios.get(`https://tcgcsv.com/${gameId}/${set.external_id.tcgcsv_id}/prices`)
              ])

              const products = productResponse.data.results.map((v: any) => ({
                ...v,
                game_id: set.game_id,
                set_id: set._id,
                // set_name: set.name,
                anniversary: set.name.includes('Anniversary') ? true : false,
                pre_release:
                  set.name.includes('Pre-Release') || set.name.includes('Prerelease') ? true : false,
                promo: set.name.match(/\bPromo\b/) || set.name.match(/\bPromos\b/) ? true : false
              }))


              const prices = priceResponse.data.results
              return { products, prices }
            } catch (axiosError) {
              console.error(`Error fetching data for set ${set._id}:`, axiosError)
              return { products: [], prices: [] }
            }
          })
        )

        const results = await Promise.all(productPromises)

        const products = results.flatMap((result) => result.products)
        const prices = results.flatMap((result) => result.prices)

        if (products.length === 0 || prices.length === 0) continue

        const productMap = new Map(products.map((product) => [product.productId, product]))

        // const newProducts = []
        // const newPrices = []

        for (const price of prices) {
          const foundProduct = productMap.get(price.productId)
          if (!foundProduct) continue

          const newProduct = extractProductData(foundProduct)
        //  if (foundProduct.pre_release || foundProduct.anniversary){
        //     console.log(foundProduct)

        //   }

          newProduct.name += foundProduct.pre_release ? ' Pre-Release Event' : ''
          newProduct.name += foundProduct.anniversary ? ' Anniversary Event' : ''
          newProduct.name += foundProduct.promo ? ' Promo' : ''



          if (
            (newProduct.type === 'Single Cards' && !newProduct.name.includes('Code Card')) ||
            newProduct.type === 'Single Cards - Leak' ||
            newProduct.name.includes('Token')
          ) {
            if (
              newProduct.name.includes(newProduct.collector_number) ||
              newProduct.collector_number == undefined
            ) {
              newProduct.name += ` (${price.subTypeName}, ${newProduct.rarity})`
             // nameQuery = `(${price.subTypeName}, ${newProduct.rarity})`;

            } else if (newProduct.collector_number != undefined) {
              newProduct.name += ` - ${newProduct.collector_number} (${price.subTypeName}, ${newProduct.rarity})`
            //  nameQuery = `(${price.subTypeName}, ${newProduct.rarity})`;
            } else {
              // console.log(newProduct)
            }
          }

          

          const existingProductData = await context.app.service('products').find({
            query: {
              'external_id.tcgcsv_id': Number(newProduct.external_id.tcgcsv_id),
              name: newProduct.name

            }
          })
          // const settingsData = await context.app.service('settings').find()
          // const settings = settingsData.data[0] || { tcgcsv_last_updated: 0 }

          const newPrice: Price = {
            market_price: price.marketPrice ? Number(price.marketPrice) : -1,
            low_price: price.lowPrice ? Number(price.lowPrice) : -1,
            mid_price: price.midPrice ? Number(price.midPrice) : -1,
            high_price: price.highPrice ? Number(price.highPrice) : -1,
            direct_low_price: price.directLowPrice ? Number(price.directLowPrice) : -1,
            timestamp: Date.now()
          }

          if (existingProductData.total === 1) {
            const existingProduct = existingProductData.data[0] as Products
           // console.log(existingProductData.data[0].name)

            //   if (existingProduct.last_updated < settings.tcgcsv_last_updated) {
            //  console.log('updating price')
            await context.app
              .service('prices')
              .create({ ...newPrice, product_id: existingProductData.data[0]._id })
            var _id = existingProduct._id as string
            await context.app.service('products').patch(_id, {
              name: newProduct.name,
              last_updated: newProduct.last_updated,
              market_price: newPrice.market_price,
              low_price: newPrice.low_price,
              high_price: newPrice.high_price,
              mid_price: newPrice.mid_price,
              direct_low_price: newPrice.direct_low_price
            })
            //  }
          } else if (existingProductData.total > 1) {
            console.log('found too many')
            console.log(existingProductData.data)
          } else if (existingProductData.total === 0){
            console.log('no match')
            newProduct.market_price = newPrice.market_price
            newProduct.low_price = newPrice.low_price
            newProduct.high_price = newPrice.high_price
            newProduct.mid_price = newPrice.mid_price
            newProduct.direct_low_price = newPrice.direct_low_price

            await context.app
              .service('products')
              .create(newProduct)
              .then(async (data) => {
                await context.app.service('prices').create({ ...newPrice, product_id: data._id })
              })
          }
        }

        // Create products in bulk
        // console.log(newProducts.length)

        // if (newProducts.length > 0) {
        //   try {
        //     console.log('trying to insert products')
        //     context.app.service('products').create(newProducts, {
        //       adapter: {
        //         multi: true
        //       }
        //     })
        //     console.log('inserted products')
        //   } catch (error: any) {
        //     if (error.code === 11000) {
        //       console.error('Duplicate key error:', error.message) // Handle duplicate key error
        //     } else {
        //       console.error('Error inserting products:', error)
        //     }
        //   }
        // }

        // console.log(newPrices.length)
        // if (newPrices.length > 0) {
        //   try {
        //     console.log('trying to insert prices')

        //     context.app
        //       .service('prices')
        //       .create(newPrices, {
        //         adapter: {
        //           multi: true
        //         }
        //       })
        //       console.log('inserted prices')

        //   } catch (error: any) {
        //     if (error.code === 11000) {
        //       console.error('Duplicate key error:', error.message) // Handle duplicate key error
        //     } else {
        //       console.error(error.message)
        //     }
        //   }
        // }

        console.log(
          'done processing batch ' + (i + batchSize) / batchSize + ' of ' + enabledSets.length / batchSize
        )
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }

    console.log(`Done. Took ${(Date.now() - startTime) / 1000} seconds`)
  }

  // const determineProductType = (foundProduct: any) => {
  //   if (foundProduct.extendedData.length <= 2) {
  //     if (foundProduct.extendedData.name && foundProduct.extendedData.name.includes('Token')) {
  //       return 'Single Cards'
  //     } else if (foundProduct.name.includes('Energy')) {
  //       return 'Single Cards'
  //     } else if (foundProduct.name.includes('Token')) {
  //       return 'Single Cards'
  //     } else if (foundProduct.name.includes('Code Card')) {
  //       return 'Single Cards'
  //     } else if (foundProduct.name.includes('Booster')) {
  //       return 'Boosters'
  //     } else if (foundProduct.name.includes('Deck')) {
  //       return 'Decks'
  //     } else if (foundProduct.name.includes('Elite Trainer Box')) {
  //       return 'Elite Trainer Boxes'
  //     } else if (foundProduct.name.includes('Double Pack')) {
  //       return 'Boosters'
  //     } else if (foundProduct.name.includes('VIP Edition Pack')) {
  //       return 'Boosters'
  //     } else if (foundProduct.name.includes('Box Topper')) {
  //       return 'Boosters'
  //     } else if (foundProduct.name.includes('Build & Battle Box')) {
  //       return 'Build & Battle Boxes'
  //     } else if (foundProduct.name.includes('Blister')) {
  //       return 'Boosters'
  //     } else if (foundProduct.name.includes('- Bundle') || foundProduct.name.includes('- Gift Bundle')) {
  //       return 'Bundles'
  //     } else if (foundProduct.name.includes('Starter Kit')) {
  //       return 'Starter Kits'
  //     } else if (foundProduct.name.includes('Prerelease Pack')) {
  //       return 'Prerelease Packs'
  //     } else if (foundProduct.name.includes('Land') && foundProduct.rarity === 'L') {
  //       return 'Single Cards'
  //     } else if (foundProduct.name.includes('Art Card') || foundProduct.url.includes('art-series')) {
  //       return 'Single Cards'
  //     } else if (foundProduct.rarity) {
  //       return 'Single Cards - Leak'
  //     } else {
  //       //  console.log(foundProduct)
  //       return 'Sealed'
  //     }
  //   } else {
  //     return 'Single Cards'
  //   }
  // }

  const determineProductType = (foundProduct: any, rarity: string) => {
    const { extendedData, name, url } = foundProduct
    const categoryId = foundProduct.categoryId || 0

    if (extendedData.length > 2 && rarity !== '') {
      return 'Single Cards'
    }

    const extendedName = extendedData.name || ''

    if (extendedName.includes('Token')) return 'Single Cards'
    if (rarity === 'L') return 'Single Cards'

    // Direct keyword checks for single card
    if (
      name.includes('Energy') ||
      name.includes('Token') ||
      name.includes('Code Card') ||
      name.includes('Land') ||
      name.includes('Art Card') ||
      name.includes('Checklist Card') ||
      url.includes('art-series')
    ) {
      return 'Single Cards'
    }

    // Direct keyword checks for boosters
    if (
      name.includes('Booster') ||
      name.includes('Double Pack') ||
      name.includes('VIP Edition Pack') ||
      name.includes('Box Topper') ||
      name.includes('Blister') ||
      name.includes('Anniversary Edition Pack') ||
      name.includes('Anniversary Edition Display') ||
      name.includes('Jumpstart') ||
      name.includes('VIP Edition') ||
      name.includes('Mythic Edition')
    ) {
      return 'Boosters'
    }

    if (name.includes('Commander')) {
      const yearMatch = name.match(/Commander (\d{4})/)
      if (yearMatch) return 'Decks'
    }
    // Direct keyword checks for decks
    if (
      name.includes('Deck') ||
      name.includes('Intro Pack') ||
      name.includes('Commander Collection') ||
      name.includes('Guild Kit') ||
      name.includes('Global Series') ||
      (name.includes('Tournament Pack') && categoryId === 1) ||
      (name.includes('Commander') && name.includes('Set of'))
    ) {
      return 'Decks'
    }

    if (name.includes('SDCC')) {
      const yearMatch = name.match(/SDCC (\d{4})/)
      if (yearMatch) return 'Promotion Cards'
    }

    if ((name.includes('Tournament Pack') && categoryId !== 1) || name.includes('Promo Pack'))
      return 'Promotion Cards'

    // Direct keyword checks for other categories
    if (name.includes('Box Set') || name.includes('Game Night') || name.includes('Scene Box'))
      return 'Box Sets'

    if (name.includes('Retail Tin')) return 'Tins'
    if (name.includes('Elite Trainer Box')) return 'Elite Trainer Boxes'
    if (name.includes('Build & Battle Box')) return 'Build & Battle Boxes'
    if (
      name.includes('Fat Pack') ||
      name.includes('- Bundle') ||
      name.includes('- Gift Bundle') ||
      (name.includes('Gift Box') && categoryId === 1) ||
      name.includes('Gift Pack') ||
      name.includes('Gift Edition')
    )
      return 'Bundles'
    if (name.includes('Starter Set') || name.includes('Starter Kit') || name.includes('Clash Pack'))
      return 'Starter Kits'
    if (name.includes('Prerelease')) return 'Prerelease Packs'
    if (name.includes('Secret Lair')) return 'Secret Lair Drop'

    // Check for rarity-based single card
    if (rarity) return 'Single Cards - Leak'

    // Default case
    return 'Sealed'
  }

  fetchProducts()
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
