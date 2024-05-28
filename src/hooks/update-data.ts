// combined-hook.ts
import { HookContext } from '../declarations'
import axios from 'axios'
import { Products } from '../services/products/products.schema'
import pLimit from 'p-limit'; // Add this import


const attributes: any[] = []
export const combinedHook = async (context: HookContext) => {
  console.log(`Running combined hook on ${context.path}.${context.method}`)

  // Fetch games
  await fetchGames(context)

  // Fetch sets
  await fetchSets(context)

  // Process products and prices
  await processProductsAndPrices(context)
}

const fetchGames = async (context: HookContext) => {
  console.log('fetching games')
  await axios.get(`https://tcgcsv.com/categories`).then(async (data: any) => {
    let d = data.data.results
    for (var i = 0; i < d.length; i++) {
      await context.app
        .service('games')
        .find({
          query: {
            'external_id.tcgcsv_id': d[i].categoryId
          }
        })
        .then((data) => {
          if (data.total == 0) {
            if (![21,69,70,82].includes(Number(d[i].categoryId))){
            context.app.service('games').create({
              name: `${d[i].displayName}`,
              external_id: {
                tcgcsv_id: d[i].categoryId
              },
              logo: `/assets/images/logos/${d[i].name}.png`
            })
          }}
        })
    }
  })
}

const fetchSets = async (context: HookContext) => {
  console.log('fetching sets')

  let startTime = Date.now()
  try {
    const data = await context.app.service('games').find({ query: { $limit: 100000 } })
    if (data.total != 0) {
      const results = data.data

      // Fetch groups for all games in parallel
      const groupPromises = results.map(async (result) => {
        const externalId = result.external_id.tcgcsv_id
        try {
          const response = await axios.get(`https://tcgcsv.com/${externalId}/groups`)
          return { result, groups: response.data.results }
        } catch (groupError) {
          console.error(`Error fetching groups for externalId ${externalId}:` /*groupError*/)
          return { result, groups: [] }
        }
      })

      const groupsData = await Promise.all(groupPromises)

      // Process sets for all games in parallel
      const setPromises = groupsData.flatMap(({ result, groups }) => {
        return groups.map(async (group: any) => {
          try {
            const setData = await context.app.service('sets').find({
              query: {
                game_id: result._id,
                name: group.name
              }
            })

            if (setData.total == 0) {
              await context.app.service('sets').create({
                game_id: result._id,
                name: group.name,
                external_id: {
                  tcgcsv_id: group.groupId
                }
              })
            }
          } catch (setError) {
            console.error(`Error processing set for game_id ${result._id} and name ${group.name}:`, setError)
          }
        })
      })

      await Promise.all(setPromises)
    }
  } catch (gameError) {
    console.error('Error fetching games:', gameError)
  }
  console.log(`Done. It took ${(Date.now() - startTime) / 1000} seconds`)
}

export const processProductsAndPrices = async (context: HookContext) => {
  console.log(`Running hook process-products-and-prices on ${context.path}.${context.method}`)
  interface ExtendedData {
    name: string
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
    collector_number?: string
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
    retreat_cost?: string
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
    image_url: string
    buying: { enabled: boolean; quantity: number }
    selling: { enabled: boolean; quantity: number }
    type: string
    last_updated: number
    _id: string
    market_price?: {
      foil?: number
      regular?: number
      reverse_foil?: number
      timestamp: number
    }
  }

  interface Price {
    product_id: string | {}
    market_price: {
      foil?: number
      normal?: number
      reverse_foil?: number
    }
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
  const extractProductData = (foundProduct: FoundProduct): NewProduct => {
    const newProduct: Partial<NewProduct> = {}
    if (foundProduct.extendedData) {
      foundProduct.extendedData.forEach(({ name, value }) => {
        switch (name) {
          case 'UPC':
            newProduct.upc = value
            break
          case 'CardText':
          case 'OracleText':
          case 'Description':
            newProduct.text = value
            break
          case 'Number':
            newProduct.collector_number = value
            break
          case 'Rarity':
            newProduct.rarity = value
            break
          case 'SubType':
          case 'SubTypes':
            newProduct.sub_type = value
            break
          case 'P':
          case 'Power':
            newProduct.power = value
            break
          case 'T':
          case 'Willpower':
            newProduct.toughness = value
            break
          case 'FlavorText':
            newProduct.flavor_text = value
            break
          case 'Card Type':
          case 'CardType':
            newProduct.card_type = value
            break
          case 'HP':
            newProduct.hp = value
            break
          case 'Stage':
            newProduct.stage = value
            break
          case 'Attack 1':
            newProduct.attack_1 = value
            break
          case 'Attack 2':
            newProduct.attack_2 = value
            break
          case 'Attack 3':
            newProduct.attack_3 = value
            break
          case 'Attack 4':
            newProduct.attack_4 = value
            break
          case 'Weakness':
            newProduct.weakness = value
            break
          case 'Resistance':
            newProduct.resistance = value
            break
          case 'Retreat Cost':
            newProduct.retreat_cost = value
            break
          case 'Color':
            newProduct.colour = value
            break
          case 'Cost':
          case 'Cost Ink':
            newProduct.cost = value
            break
          case 'Life':
            newProduct.life = value
            break
          case 'Counterplus':
            newProduct.counter = value
            break
          case 'Attribute':
            newProduct.attribute = value
            break
          case 'Combo Power':
            newProduct.combo_power = value
            break
          case 'Character Traits':
            newProduct.sub_type = value
            break
          case 'Property':
            newProduct.property = value
            break
          case 'InkType':
            newProduct.ink_type = value
            break
          case 'Strength':
            newProduct.power = value
            break
          case 'Lore Value':
            newProduct.lore_value = value
            break
          default:
           // if (!attributes.find(attr => attr.game === foundProduct.game_id && attr.name === value)) {
              attributes.push({ game: foundProduct.game_id, name: value });
           // }
        }
      })
    } else {
      console.log(foundProduct)
    }

    newProduct.set_id = foundProduct.set_id
    newProduct.game_id = foundProduct.game_id
    newProduct.external_id = {
      tcgcsv_id: Number(foundProduct.productId),
      tcgcsv_category_id: Number(foundProduct.categoryId),
      tcgcsv_group_id: Number(foundProduct.groupId)
    }
    newProduct.name = `${foundProduct.name}`
    newProduct.image_url = `${foundProduct.imageUrl.slice(0, -8)}400w.jpg`
    newProduct.buying = { enabled: false, quantity: 0 }
    newProduct.selling = { enabled: false, quantity: 0 }
    newProduct.type = determineProductType(foundProduct)

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
        console.log('processing batch ' + (i + batchSize) / batchSize + ' of ' + Math.ceil((enabledSets.length / batchSize)))
        const batch = enabledSets.slice(i, i + batchSize)

        const productPromises = batch.map((set) => limit(async () => {
          const gameId = await getExternalIdForGame(set.game_id.toString())

    
          try {
            const [productResponse, priceResponse] = await Promise.all([
              axios.get(`https://tcgcsv.com/${gameId}/${set.external_id.tcgcsv_id}/products`),
              axios.get(`https://tcgcsv.com/${gameId}/${set.external_id.tcgcsv_id}/prices`)
            ])

            const products = productResponse.data.results.map((v: any) => ({
              ...v,
              game_id: set.game_id,
              set_id: set._id
            }))

            const prices = priceResponse.data.results
            return { products, prices }
          } catch (axiosError) {
            console.error(`Error fetching data for set ${set._id}:`, axiosError)
            return { products: [], prices: [] }
          }
        }));

        const results = await Promise.all(productPromises)

        const products = results.flatMap((result) => result.products)
        const prices = results.flatMap((result) => result.prices)

        if (products.length === 0 || prices.length === 0) continue

        const productMap = new Map(products.map((product) => [product.productId, product]))

        const newProducts = []
        const newPrices = []

        for (const price of prices) {
          const foundProduct = productMap.get(price.productId)
          if (!foundProduct) continue

          const newProduct = extractProductData(foundProduct)

          if (
            (newProduct.type === 'Single Cards' && !newProduct.name.includes('Code Card')) ||
            (newProduct.type === 'Single Cards' && (!newProduct.name.includes('Art Card') || !newProduct.name.includes('Art Series'))) ||
            newProduct.type === 'Single Cards - Leak' ||
            newProduct.name.includes('Token')
          ) {
            if (
              foundProduct.name.includes(newProduct.collector_number) ||
              newProduct.collector_number == undefined
            ) {
              newProduct.name += ` (${price.subTypeName}, ${newProduct.rarity})`
            } else if (newProduct.collector_number != undefined) {
              newProduct.name += ` - ${newProduct.collector_number} (${price.subTypeName}, ${newProduct.rarity})`
            } else {
              // console.log(newProduct)
            }
          }

          const existingProductData = await context.app.service('products').find({
            query: {
              name: newProduct.name,
              'external_id.tcgcsv_id': Number(newProduct.external_id.tcgcsv_id)
            }
          })

          const settingsData = await context.app.service('settings').find()
          const settings = settingsData.data[0] || { tcgcsv_last_updated: 0 }

          const newPrice: Price = {
            market_price: {
              [price.subTypeName]: Number(price.marketPrice || price.midPrice)
            },
            timestamp: Date.now(),
            product_id: existingProductData.total > 0 ? existingProductData.data[0]._id : {}
          }

          if (existingProductData.total > 0) {
            const existingProduct = existingProductData.data[0] as Products

            if (existingProduct.last_updated < settings.tcgcsv_last_updated) {
              //  console.log('updating price')
              await context.app.service('prices').create(newPrice)
              var _id = existingProduct._id as string
              await context.app.service('products').patch(_id, {
                last_updated: newProduct.last_updated,
                market_price: { ...newPrice.market_price, timestamp: Date.now() }
              })
            }
          } else if (existingProductData.total > 1) {
            console.log('found too many')
          } else {
            //   console.log('no match')
            newProduct.market_price = { ...newPrice.market_price, timestamp: Date.now() }
            
            await context.app.service('products').create(newProduct)
            await context.app.service('prices').create(newPrice)
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

        console.log('done processing batch ' + (i + batchSize) / batchSize + ' of ' + enabledSets.length / batchSize)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }

    console.log(`Done. Took ${(Date.now() - startTime) / 1000} seconds`)
    const uniqueArray = attributes.filter((obj, index, self) => {
      // Create a unique key based on the properties you want to check for uniqueness
      const key = `${obj.game}-${obj.name}`;
      
      // Check if this key is already seen, if not, add it to the set
      return index === self.findIndex((o) => `${o.game}-${o.name}` === key);
    });
    uniqueArray.forEach(att => {
      console.log(att)
    })
    console.log(uniqueArray)
  }

  const determineProductType = (foundProduct: any) => {
    if (foundProduct.extendedData.length <= 2) {
      if (foundProduct.extendedData.name && foundProduct.extendedData.name.includes('Token')) {
        return 'Single Cards'
      } else if (foundProduct.name.includes('Energy')) {
        return 'Single Cards'
      } else if (foundProduct.name.includes('Token')) {
        return 'Single Cards'
      } else if (foundProduct.name.includes('Code Card')) {
        return 'Single Cards'
      } else if (foundProduct.name.includes('Booster')) {
        return 'Boosters'
      } else if (foundProduct.name.includes('Deck')) {
        return 'Decks'
      } else if (foundProduct.name.includes('Elite Trainer Box')) {
        return 'Elite Trainer Boxes'
      } else if (foundProduct.name.includes('Double Pack')) {
        return 'Boosters'
      }else if (foundProduct.name.includes('VIP Edition Pack')) {
        return 'Boosters'
      } else if (foundProduct.name.includes('Box Topper')) {
        return 'Boosters'
      }else if (foundProduct.name.includes('Build & Battle Box')) {
        return 'Build & Battle Boxes'
      } else if (foundProduct.name.includes('Blister')) {
        return 'Boosters'
      } else if (foundProduct.name.includes('- Bundle') || foundProduct.name.includes('- Gift Bundle')) {
        return 'Bundles'
      } else if (foundProduct.name.includes('Starter Kit')) {
        return 'Starter Kits'
      } else if (foundProduct.name.includes('Prerelease Pack')) {
        return 'Prerelease Packs'
      } else if (foundProduct.name.includes('Land')&& foundProduct.rarity === 'L') {
        return 'Single Cards'
      }else if (foundProduct.name.includes('Art Card') || foundProduct.url.includes('art-series')) {
        return 'Single Cards'
      } else if (foundProduct.rarity) {
        return 'Single Cards - Leak'
      } else {
        //  console.log(foundProduct)
        return 'Sealed'
      }
    } else {
      return 'Single Cards'
    }
  }

  fetchProducts()
}
