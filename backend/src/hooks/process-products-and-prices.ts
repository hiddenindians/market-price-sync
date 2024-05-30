// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import { ObjectId } from 'mongodb'
import { Products } from '../client'
import type { HookContext } from '../declarations'
import { start } from 'repl'
import axios from 'axios' // Corrected import statement

export const processProductsAndPrices = async (context: HookContext) => {
  // console.log(`Running hook process-products-and-prices on ${context.path}.${context.method}`)
  // interface ExtendedData {
  //   name: string
  //   value: string
  // }

  // interface FoundProduct {
  //   extendedData?: ExtendedData[]
  //   set_id: string
  //   game_id: string
  //   productId: string
  //   categoryId: string
  //   groupId: string
  //   name: string
  //   imageUrl: string
  // }

  // interface NewProduct {
  //   upc?: string
  //   text?: string
  //   collector_number?: string
  //   rarity?: string
  //   sub_type?: string
  //   power?: string
  //   toughness?: string
  //   flavor_text?: string
  //   card_type?: string
  //   hp?: string
  //   stage?: string
  //   attack_1?: string
  //   attack_2?: string
  //   attack_3?: string
  //   attack_4?: string
  //   weakness?: string
  //   resistance?: string
  //   retreat_cost?: number
  //   colour?: string
  //   cost?: string
  //   life?: string
  //   counter?: string
  //   attribute?: string
  //   combo_power?: string
  //   property?: string
  //   ink_type?: string
  //   lore_value?: string
  //   set_id: string
  //   game_id: string
  //   external_id: {
  //     tcgcsv_id: number
  //     tcgcsv_category_id: number
  //     tcgcsv_group_id: number
  //   }
  //   name: string
  //   image_url: string
  //   buying: { enabled: boolean; quantity: number }
  //   selling: { enabled: boolean; quantity: number }
  //   type: string
  //   last_updated: number
  //   _id: string
  //   market_price?: {
  //     foil?: number
  //     regular?: number
  //     reverse_foil?: number
  //     timestamp: number
  //   }
  // }

  // interface Price {
  //   product_id: string | {}
  //   market_price: {
  //     foil?: number
  //     normal?: number
  //     reverse_foil?: number
  //   }
  //   timestamp: number
  // }

  // interface EnabledSet {
  //   game_id: string
  //   external_id: { tcgcsv_id: number }
  //   _id: string
  // }

  // interface ProductResponse {
  //   results: FoundProduct[]
  // }

  // interface PriceResponse {
  //   results: Price[]
  // }

  // interface Settings {
  //   tcgcsv_last_updated: Number
  // }
  // const getExternalIdForGame = async (gameId: string) => {
  //   let toReturn = null
  //   await context.app
  //     .service('games')
  //     .find({
  //       query: {
  //         _id: gameId
  //       }
  //     })
  //     .then((data) => {
  //       if (data.data[0].external_id) {
  //         toReturn = data.data[0].external_id.tcgcsv_id
  //       }
  //     })

  //   return toReturn
  // }
  // const extractProductData = (foundProduct: FoundProduct): NewProduct => {
  //   const newProduct: Partial<NewProduct> = {}
  //   if (foundProduct.extendedData) {
  //     foundProduct.extendedData.forEach(({ name, value }) => {
  //       switch (name) {
  //         case 'UPC':
  //           newProduct.upc = value
  //           break
  //         case 'CardText':
  //         case 'OracleText':
  //         case 'Description':
  //           newProduct.text = value
  //           break
  //         case 'Number':
  //           newProduct.collector_number = value
  //           break
  //         case 'Rarity':
  //           newProduct.rarity = value
  //           break
  //         case 'SubType':
  //         case 'SubTypes':
  //           newProduct.sub_type = value
  //           break
  //         case 'P':
  //         case 'Power':
  //           newProduct.power = value
  //           break
  //         case 'T':
  //         case 'Willpower':
  //           newProduct.toughness = value
  //           break
  //         case 'FlavorText':
  //           newProduct.flavor_text = value
  //           break
  //         case 'Card Type':
  //         case 'CardType':
  //           newProduct.card_type = value
  //           break
  //         case 'HP':
  //           newProduct.hp = value
  //           break
  //         case 'Stage':
  //           newProduct.stage = value
  //           break
  //         case 'Attack 1':
  //           newProduct.attack_1 = value
  //           break
  //         case 'Attack 2':
  //           newProduct.attack_2 = value
  //           break
  //         case 'Attack 3':
  //           newProduct.attack_3 = value
  //           break
  //         case 'Attack 4':
  //           newProduct.attack_4 = value
  //           break
  //         case 'Weakness':
  //           newProduct.weakness = value
  //           break
  //         case 'Resistance':
  //           newProduct.resistance = value
  //           break
  //         case 'Retreat Cost':
  //           newProduct.retreat_cost = Number(value)
  //           break
  //         case 'Color':
  //           newProduct.colour = value
  //           break
  //         case 'Cost':
  //         case 'Cost Ink':
  //           newProduct.cost = value
  //           break
  //         case 'Life':
  //           newProduct.life = value
  //           break
  //         case 'Counterplus':
  //           newProduct.counter = value
  //           break
  //         case 'Attribute':
  //           newProduct.attribute = value
  //           break
  //         case 'Combo Power':
  //           newProduct.combo_power = value
  //           break
  //         case 'Character Traits':
  //           newProduct.sub_type = value
  //           break
  //         case 'Property':
  //           newProduct.property = value
  //           break
  //         case 'InkType':
  //           newProduct.ink_type = value
  //           break
  //         case 'Strength':
  //           newProduct.power = value
  //           break
  //         case 'Lore Value':
  //           newProduct.lore_value = value
  //           break
  //         default:
  //           console.log(`${name}: ${value}`)
  //       }
  //     })
  //   } else {
  //     console.log(foundProduct)
  //   }

  //   newProduct.set_id = foundProduct.set_id
  //   newProduct.game_id = foundProduct.game_id
  //   newProduct.external_id = {
  //     tcgcsv_id: Number(foundProduct.productId),
  //     tcgcsv_category_id: Number(foundProduct.categoryId),
  //     tcgcsv_group_id: Number(foundProduct.groupId)
  //   }
  //   newProduct.name = `${foundProduct.name}`
  //   newProduct.image_url = `${foundProduct.imageUrl.slice(0, -8)}400w.jpg`
  //   newProduct.buying = { enabled: false, quantity: 0 }
  //   newProduct.selling = { enabled: false, quantity: 0 }
  //   newProduct.type = determineProductType(foundProduct)

  //   newProduct.last_updated = Date.now()

  //   return newProduct as NewProduct
  // }
  // const fetchProducts = async () => {
    
  //   const startTime = Date.now()
  //   console.log('starting')
  //   try {
  //     const enabledSetsData = await context.app.service('sets').find({ query: { $limit: 100000 } })
  //     if (enabledSetsData.total === 0) {
  //       console.log('no sets')
  //       return
  //     }

  //     const enabledSets = enabledSetsData.data

  //     const productPromises = enabledSets.map(async (set) => {
  //       const gameId = await getExternalIdForGame(set.game_id.toString())
  //       const [productResponse, priceResponse] = await Promise.all([
  //         axios.get(`https://tcgcsv.com/${gameId}/${set.external_id.tcgcsv_id}/products`),
  //         axios.get(`https://tcgcsv.com/${gameId}/${set.external_id.tcgcsv_id}/prices`)
  //       ])

  //       const products = productResponse.data.results.map((v: any) => ({
  //         ...v,
  //         game_id: set.game_id,
  //         set_id: set._id
  //       }))

  //       const prices = priceResponse.data.results
  //       return { products, prices }
  //     })

  //     const results = await Promise.all(productPromises)

  //     const products = results.flatMap((result) => result.products)
  //     const prices = results.flatMap((result) => result.prices)

  //     if (products.length === 0 || prices.length === 0) return

  //     const productMap = new Map(products.map((product) => [product.productId, product]))

  //     const updatedProducts = await Promise.all(
  //       prices.map(async (price) => {
  //         const foundProduct = productMap.get(price.productId)
  //         if (!foundProduct) return null

  //         const newProduct = extractProductData(foundProduct)

  //         if (newProduct.type === 'Single Cards' && !newProduct.name.includes('Code Card')) {
  //           if (
  //             foundProduct.name.includes(newProduct.collector_number) ||
  //             newProduct.collector_number == undefined
  //           ) {
  //             newProduct.name += ` (${price.subTypeName}, ${newProduct.rarity})`
  //           } else if (newProduct.collector_number != undefined) {
  //             newProduct.name += ` - ${newProduct.collector_number} (${price.subTypeName}, ${newProduct.rarity})`
  //           }
  //         }

  //         // if(!newProduct.collector_number){
  //         //   newProduct.collector_number = "0"
  //         // }

  //         // const existingProduct = await client.service('products').find({
  //         //   query: {
  //         //     external_id: {
  //         //       tcgcsv_id: newProduct.external_id.tcgcsv_id
  //         //     }
  //         //   }
  //         // })

  //         const existingProductData = await context.app.service('products').find({
  //           query: {
  //             name: newProduct.name,
  //             'external_id.tcgcsv_id': Number(newProduct.external_id.tcgcsv_id)
  //           }
  //         })
  //         const existingProduct = existingProductData.data[0] as Products

  //         const settingsData = await context.app.service('settings').find()
  //         const settings = settingsData.data[0]
  //         const newPrice: Price = {
  //           market_price: {
  //             [price.subTypeName]: Number(price.marketPrice || price.midPrice)
  //           },
  //           timestamp: Date.now(),
  //           product_id: existingProduct._id
  //         }
  //         console.log(newPrice)
  //         if (existingProductData.total == 1) {
  //           console.log('exists')
  //           if (existingProduct.last_updated < settings.tcgcsv_last_updated) {
  //             console.log('updating price')
  //             await context.app.service('prices').create(newPrice)
  //             var _id = existingProduct._id as string
  //             await context.app
  //               .service('products')
  //               .patch(_id, {
  //                 last_updated: newProduct.last_updated,
  //                 market_price: { ...newPrice.market_price, timestamp: Date.now() }
  //               })
  //           }
  //         } else if (existingProductData.total > 1) {
  //           console.log('found too many')
  //         } else {
  //           console.log('no match')
  //           // console.log(newProduct)
  //           newProduct.market_price = { ...newPrice.market_price, timestamp: Date.now()}
  //           const insertedProduct = await context.app.service('products').create(newProduct)
  //           await context.app.service('prices').create(newPrice)
  //         }

  //         return { ...newProduct }
  //       })
  //     )

  //     //console.log(updatedProducts.filter((product) => product !== null))
  //   } catch (error) {
  //     console.error('Error fetching products:', error)
  //   }

  //   console.log(`Done. Took ${(Date.now() - startTime) / 1000} seconds`)
  // }

  // const determineProductType = (foundProduct: any) => {
  //   if (foundProduct.extendedData.length <= 2) {
  //     if (foundProduct.extendedData.name && foundProduct.extendedData.name.includes('Token')) {
  //       return 'Single Cards'
  //     } else if (foundProduct.name.includes('Energy')) {
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
  //     } else if (foundProduct.name.includes('Build & Battle Box')) {
  //       return 'Build & Battle Boxes'
  //     } else if (foundProduct.name.includes('Blister')) {
  //       return 'Boosters'
  //     } else {
  //       return 'sealed'
  //     }
  //   } else {
  //     return 'Single Cards'
  //   }
  // }

  // fetchProducts()
}
