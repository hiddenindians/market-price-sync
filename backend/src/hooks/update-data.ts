import { HookContext } from '../declarations'
import axios from 'axios'
import { Products } from '../services/products/products.schema'
import pLimit from 'p-limit'
import { ObjectId } from 'mongodb'
import {
  deriveFinishKey,
  detectPrintVariant,
  isFinishKey,
  isFoilVariantKey,
  normalizePrint
} from '../utils/print-normalizer'
import { ConcurrentPipeline, createRateLimitedAxios } from '../utils/concurrent-pipeline'

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

// Update these keyword lists whenever new naming patterns should count as events or promos.
const EVENT_KEYWORD_BUCKETS: Record<string, string[]> = {
  anniversary: ['Anniversary Tournament'],
  preRelease: ['Pre-Release', 'Prerelease'],
  release: ['Release Event'],
  general: ['Finalist', 'Championship', 'Participant', 'New Year Event', '3-on-3 Cup', 'Treasure Cup']
}

const PROMO_KEYWORDS: string[] = [
  'Promo',
  'Promos',
  'Promo Pack',
  'Promotional',
  'Tournament Pack',
  'Secret Lair',
  'SDCC'
]

const PROMO_SUFFIX_KEYWORDS: string[] = [
  'Promo',
  'Promos',
  'Promo Pack',
  'Promotional',
  'Secret Lair',
  'SDCC'
]

/**
 * Tokenizes a string or null value into an array of lowercase alphanumeric words
 * @param value - The string to tokenize
 * @returns Array of tokenized words
 */
const tokenize = (value?: string | null): string[] =>
  (value ?? '')
    .toString()
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

/**
 * Checks if a sequence of keyword tokens appears consecutively in source tokens
 * @param sourceTokens - Array of tokens from the source
 * @param keywordTokens - Array of tokens to match
 * @returns True if the keyword sequence is found
 */
const containsKeywordSequence = (sourceTokens: string[], keywordTokens: string[]): boolean => {
  if (!sourceTokens.length || !keywordTokens.length) {
    return false
  }

  if (keywordTokens.length === 1) {
    return sourceTokens.includes(keywordTokens[0])
  }

  for (let i = 0; i <= sourceTokens.length - keywordTokens.length; i += 1) {
    let matches = true
    for (let j = 0; j < keywordTokens.length; j += 1) {
      if (sourceTokens[i + j] !== keywordTokens[j]) {
        matches = false
        break
      }
    }
    if (matches) {
      return true
    }
  }

  return false
}

/**
 * Checks if any keyword matches any source by tokenizing and checking sequences
 * @param sources - Array of source strings
 * @param keywords - Array of keywords to match
 * @returns True if any keyword matches
 */
const keywordMatch = (sources: string[], keywords: string[]): boolean => {
  if (!Array.isArray(sources) || !Array.isArray(keywords) || keywords.length === 0) {
    return false
  }

  const sourceTokenSets = sources.map((source) => tokenize(source)).filter((tokens) => tokens.length > 0)

  if (!sourceTokenSets.length) {
    return false
  }

  const keywordTokenSets = keywords.map((keyword) => tokenize(keyword)).filter((tokens) => tokens.length > 0)

  if (!keywordTokenSets.length) {
    return false
  }

  return keywordTokenSets.some((keywordTokens) =>
    sourceTokenSets.some((sourceTokens) => containsKeywordSequence(sourceTokens, keywordTokens))
  )
}

// --- Rate limiter & metrics for external API calls ---
const RATE_LIMIT = Number(process.env.TCGCSV_RATE_LIMIT || '9')

interface GameGroupsData {
  game: any
  groups: any[]
}

interface SetData {
  set: any
  products: any[]
  prices: any[]
}

const rateLimitedAxios = createRateLimitedAxios(RATE_LIMIT)

// setInterval(() => {
//   console.info(`[rate] limit: ${RATE_LIMIT}/s`)
// }, 5000)

// --- end rate limiter ---

/**
 * Makes a rate-limited GET request
 * @param url - The URL to request
 * @param opts - Optional request options
 * @returns Promise resolving to the response data
 */
const rateLimitedGet = async <T = any>(url: string, opts?: any): Promise<T> => {
  return rateLimitedAxios.get<T>(url, opts)
}

/**
 * Main combined hook function that fetches games, sets, and processes products and prices
 * @param context - The hook context
 */
export const combinedHook = async (context: HookContext) => {
  console.time('Total Execution Time')
  // console.log(`Running combined hook on ${context.path}.${context.method}`)

  console.time('fetchGames')
  await fetchGames(context)
  console.timeEnd('fetchGames')

  // Note: fetchGames will use rateLimitedGet to avoid exceeding API rate limits.

  console.time('fetchSets')
  await fetchSets(context)
  console.timeEnd('fetchSets')

  console.time('processProductsAndPrices')
  await processProductsAndPrices(context)
  console.timeEnd('processProductsAndPrices')

  console.timeEnd('Total Execution Time')
}

/**
 * Fetches games from the TCGCSV API and creates new games in the database
 * @param context - The hook context
 */
const fetchGames = async (context: HookContext) => {
  console.log('fetching games')
  const response = await rateLimitedGet<{ results: any[] }>(`https://tcgcsv.com/tcgplayer/categories`)
  const games = response.results

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

/**
 * Fetches sets for each game using a concurrent pipeline and updates or creates sets in the database
 * @param context - The hook context
 */
const fetchSets = async (context: HookContext) => {
  console.log('fetching sets')

  const games = await context.app.service('games').find({ query: {}, paginate: false })

  const errors: Array<{ gameId: number; error: unknown }> = []
  const newSets: Array<{ game_id: any; name: string; code: string; external_id: { tcgcsv_id: number } }> = []
  const setsToUpdate: Array<{ id: string; data: { name: string; code: string } }> = []
  let processedCount = 0
  const totalGames = games.length
  const startTime = Date.now()

  console.log(`[fetchSets] Starting to fetch sets for ${totalGames} games`)

  const pipeline = new ConcurrentPipeline<GameGroupsData>({
    fetchConcurrency: 5,
    processConcurrency: 5,
    dbConcurrency: 3,
    dbBatchSize: 2000,
    rateLimit: RATE_LIMIT
  })

  pipeline.setContext(context)

  for (const game of games) {
    pipeline.addFetchTask(async () => {
      const fetchStartTime = Date.now()
      try {
        const response = await rateLimitedGet<{ results: any[] }>(
          `https://tcgcsv.com/tcgplayer/${game.external_id.tcgcsv_id}/groups`
        )
        const duration = Date.now() - fetchStartTime
        console.log(
          `[fetchSets] Fetched groups for game ${game.external_id.tcgcsv_id} (${game.name}) - ${response.results?.length || 0} groups in ${duration}ms`
        )
        return { game, groups: response.results || [] }
      } catch (error) {
        console.error(`[fetchSets] Error fetching groups for game ${game.external_id.tcgcsv_id}:`, error)
        throw error
      }
    })
  }

  pipeline.onProcess(async ({ game, groups }: GameGroupsData) => {
    try {
      const existingSetsResult = await context.app.service('sets').find({
        query: { game_id: game._id },
        paginate: false
      })

      const existingSets = (existingSetsResult as any).data || existingSetsResult

      interface SetRecord {
        _id: string
        name: string
        code: string
        external_id: { tcgcsv_id: number }
      }

      const existingSetMap = new Map<number, SetRecord>(
        existingSets.map((s: SetRecord) => [s.external_id.tcgcsv_id, s])
      )

      const localNewSets: Array<{
        game_id: any
        name: string
        code: string
        external_id: { tcgcsv_id: number }
      }> = []
      const localSetsToUpdate: Array<{ id: string; data: { name: string; code: string } }> = []

      for (const group of groups) {
        const groupId = Number(group.groupId)
        const existingSet = existingSetMap.get(groupId)

        if (existingSet) {
          const needsUpdate =
            existingSet.name !== group.name || existingSet.code !== (group.abbreviation || '')

          if (needsUpdate) {
            localSetsToUpdate.push({
              id: existingSet._id,
              data: {
                name: group.name,
                code: group.abbreviation || ''
              }
            })
          }
        } else {
          localNewSets.push({
            game_id: game._id,
            name: group.name,
            code: group.abbreviation || '',
            external_id: { tcgcsv_id: groupId }
          })
        }
      }

      newSets.push(...localNewSets)
      setsToUpdate.push(...localSetsToUpdate)

      processedCount++
      if (processedCount % 20 === 0) {
        const elapsed = Date.now() - startTime
        const rate = processedCount / (elapsed / 1000)
        console.log(
          `[fetchSets] Processed ${processedCount}/${totalGames} games (${rate.toFixed(2)}/s), collected ${newSets.length} new sets, ${setsToUpdate.length} updates`
        )
      }

      return { newProducts: [], updatedProducts: [], productsToMigrate: [] }
    } catch (error) {
      errors.push({ gameId: game.external_id.tcgcsv_id, error })
      return { newProducts: [], updatedProducts: [], productsToMigrate: [] }
    }
  })

  await pipeline.run()

  await pipeline.drain()

  if (errors.length > 0) {
    console.warn(`[fetchSets] Completed with ${errors.length} errors:`)
    errors.forEach(({ gameId, error }) => {
      console.warn(`  - Game ${gameId}: ${error}`)
    })
  }

  const createStartTime = Date.now()
  if (newSets.length > 0) {
    console.log(`[fetchSets] Creating ${newSets.length} new sets`)
    await context.app.service('sets').create(newSets)
  }

  if (setsToUpdate.length > 0) {
    console.log(`[fetchSets] Updating ${setsToUpdate.length} existing sets`)
    const updatePromises = setsToUpdate.map(({ id, data }) => context.app.service('sets').patch(id, data))
    await Promise.all(updatePromises)
  }

  const totalDuration = Date.now() - startTime
  console.log(
    `[fetchSets] Completed. New: ${newSets.length}, Updated: ${setsToUpdate.length}, Errors: ${errors.length}, Total duration: ${totalDuration}ms`
  )
}

/**
 * Parses a string to a number if possible, otherwise returns the string
 * @param input - The string to parse
 * @returns The parsed number or the original string
 */
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
/**
 * Extracts product data from a found product and returns a new product object
 * @param foundProduct - The product data from the API
 * @returns A new product object with extracted data
 */
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
  newProduct.print = 'base'
  newProduct.finish = 'base'
  return newProduct as NewProduct
}

/**
 * Processes products and prices for all sets using a concurrent pipeline, handling creation, updates, and migrations
 * @param context - The hook context
 */
const processProductsAndPrices = async (context: HookContext) => {
  console.log(`Running processProductsAndPrices on ${context.path}.${context.method}`)
  console.time('processProductsAndPrices Total Time')

  console.time('Initial Data Fetch')
  const [sets, games, existingProducts] = await Promise.all([
    context.app.service('sets').find({ query: {}, paginate: false }),
    context.app.service('games').find({ query: {}, paginate: false }),
    context.app.service('products').find({ query: {}, paginate: false })
  ])
  console.timeEnd('Initial Data Fetch')

  const gameIdMap = new Map(games.map((game: any) => [game._id.toString(), game.external_id.tcgcsv_id]))
  const setMap = new Map(sets.map((set: any) => [set._id.toString(), set]))

  const existingProductsMap = new Map<string, string>()
  existingProducts.forEach((p: any) => {
    const key = buildProductKey(
      p.external_id?.tcgcsv_id?.toString() || '',
      p.type || 'Sealed',
      p.collector_number || '',
      p.rarity || '',
      p.print || '',
      p.finish || '',
      p.external_id?.tcgcsv_group_id?.toString() || ''
    )
    if (key) {
      existingProductsMap.set(key, p._id)
    }
  })

  const newProductsMap = new Map<string, boolean>()

  const errors: Array<{ setId: string; error: unknown }> = []

  let processedCount = 0
  const totalSets = sets.length
  const startTime = Date.now()

  console.log(`[processProductsAndPrices] Starting concurrent pipeline for ${totalSets} sets`)

  const pipeline = new ConcurrentPipeline({
    fetchConcurrency: 8,
    processConcurrency: 8,
    dbConcurrency: 5,
    dbBatchSize: 2000,
    rateLimit: RATE_LIMIT
  })

  pipeline.setContext(context)

  const productIdToNewSetMap = new Map<number, string>()

  for (const set of sets) {
    pipeline.addFetchTask(async () => {
      const fetchStartTime = Date.now()
      const gameId = gameIdMap.get(set.game_id.toString())

      if (!gameId) {
        throw new Error(`No game ID found for set ${set._id}`)
      }

      try {
        const [productResponse, priceResponse] = await Promise.all([
          rateLimitedGet<{ results: any[] }>(
            `https://tcgcsv.com/tcgplayer/${gameId}/${set.external_id.tcgcsv_id}/products`
          ),
          rateLimitedGet<{ results: any[] }>(
            `https://tcgcsv.com/tcgplayer/${gameId}/${set.external_id.tcgcsv_id}/prices`
          )
        ])

        const productData = productResponse.results || []
        let priceData = priceResponse.results || []

        // Deduplicate prices by productId and subTypeName
        const priceMap = new Map<string, any>()
        const priceCountBefore = priceData.length
        priceData.forEach((p: any) => {
          const key = `${p.productId}_${p.subTypeName || 'Normal'}`
          if (!priceMap.has(key)) {
            priceMap.set(key, p)
          }
        })
        priceData = Array.from(priceMap.values())
        const duplicatesRemoved = priceCountBefore - priceData.length
        if (duplicatesRemoved > 0) {
          console.log(
            `[processProductsAndPrices] Set ${set._id}: Deduplicated ${duplicatesRemoved} price entries from API response`
          )
        }

        const products = productData.map((p: any) => {
          const sources = [set.name ?? '', set.code ?? '', p.name ?? '']
          const anniversary = keywordMatch(sources, EVENT_KEYWORD_BUCKETS.anniversary)
          const preRelease = keywordMatch(sources, EVENT_KEYWORD_BUCKETS.preRelease)
          const release = keywordMatch(sources, EVENT_KEYWORD_BUCKETS.release)
          const genericEvent = keywordMatch(sources, EVENT_KEYWORD_BUCKETS.general)
          const promo = keywordMatch(sources, PROMO_KEYWORDS)

          return {
            ...p,
            game_id: set.game_id,
            set_id: set._id,
            anniversary,
            pre_release: preRelease,
            release,
            event_keyword: genericEvent,
            promo
          }
        })

        const duration = Date.now() - fetchStartTime
        console.log(
          `[processProductsAndPrices] Fetched set ${set._id} (${set.name}) - ${products.length} products, ${priceData.length} prices in ${duration}ms`
        )

        return { set, products, prices: priceData }
      } catch (error) {
        console.error(`[processProductsAndPrices] Error fetching data for set ${set._id}:`, error)
        throw error
      }
    })
  }

  pipeline.onProcess(async ({ set, products, prices }: SetData) => {
    const batchDuplicates = new Map<string, number>()
    const localNewProducts: NewProduct[] = []
    const localUpdatedProducts: Array<{ id: string; data: any }> = []
    const localMigrations: Array<{
      id: string
      currentSetId: string
      newSetId: string
      tcgcsvId: number
      name: string
    }> = []

    try {
      for (const prod of products) {
        productIdToNewSetMap.set(prod.productId, prod.set_id.toString())
      }

      const productMap = new Map<number, any>()
      for (const prod of products) {
        productMap.set(prod.productId, prod)
      }

      for (const price of prices) {
        const prod = productMap.get(price.productId)
        if (!prod) continue

        let newProduct = extractProductData(prod)

        const finishInfo = normalizePrint(price.subTypeName)
        const finishKey = deriveFinishKey(finishInfo.key)
        const finishVariantKey = isFoilVariantKey(finishInfo.key) ? finishInfo.key : null

        const variantInfo = detectPrintVariant({
          name: prod.name,
          short_name: prod.cleanName ?? prod.name,
          extended_data: newProduct.extended_data
        })

        let printKey = variantInfo.key
        if (!printKey || printKey === 'base' || isFinishKey(printKey)) {
          printKey = finishVariantKey ?? 'base'
        }

        newProduct.print = printKey
        newProduct.finish = finishKey

        const extIdStr = newProduct.external_id.tcgcsv_id.toString()

        const productKey = buildProductKey(
          extIdStr,
          newProduct.type,
          newProduct.collector_number || '',
          newProduct.rarity || '',
          printKey,
          finishKey,
          newProduct.external_id.tcgcsv_group_id.toString()
        )

        const eventSuffixes = [
          {
            condition: prod.pre_release,
            suffix: '(Pre-Release Event)',
            keywords: EVENT_KEYWORD_BUCKETS.preRelease
          },
          { condition: prod.release, suffix: '(Release Event)', keywords: EVENT_KEYWORD_BUCKETS.release },
          {
            condition: prod.anniversary,
            suffix: '(Anniversary Event)',
            keywords: EVENT_KEYWORD_BUCKETS.anniversary
          },
          {
            condition: (prod.promo || newProduct.rarity === 'PR') && newProduct.rarity !== 'Promo',
            suffix: '(Promo)',
            keywords: PROMO_SUFFIX_KEYWORDS
          }
        ]

        for (const { condition, suffix, keywords } of eventSuffixes) {
          if (condition) {
            const alreadyHasKeyword = keywordMatch([newProduct.name], keywords)
            const alreadyHasSuffix = newProduct.name.toLowerCase().includes(suffix.toLowerCase())

            if (!alreadyHasKeyword && !alreadyHasSuffix) {
              newProduct.name += ` ${suffix}`
            }
          }
        }

        newProduct.market_price = price.marketPrice ? Number(price.marketPrice) : -1
        newProduct.low_price = price.lowPrice ? Number(price.lowPrice) : -1
        newProduct.mid_price = price.midPrice ? Number(price.midPrice) : -1
        newProduct.high_price = price.highPrice ? Number(price.highPrice) : -1
        newProduct.direct_low_price = price.directLowPrice ? Number(price.directLowPrice) : -1

        const eventTypes: string[] = []
        if (prod.pre_release) eventTypes.push('pre_release')
        if (prod.release) eventTypes.push('release')
        if (prod.anniversary) eventTypes.push('anniversary')
        if (prod.event_keyword) eventTypes.push('event')
        if (prod.promo) eventTypes.push('promo')
        newProduct.event_types = eventTypes

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

        // Apply set-specific name disambiguation before duplicate check
        const setData = setMap.get(newProduct.set_id.toString())
        if (setData && setData.name === 'The List Reprints' && !newProduct.name.includes('(LIST)')) {
          newProduct.name += ' (LIST)'
        }

        if (
          setData &&
          setData.name.includes('Revision Pack') &&
          (setData.code === 'OPRP' || setData.code === 'RP20' || setData.code === 'RPC')
        ) {
          newProduct.name += ' (Revision Pack)'
        }

        if (newProduct.name.includes('DON!! Card') && setData) {
          let code = setData.code && setData.code !== '' ? setData.code : setData.name
          if (code) {
            const suffix = ` (${code})`
            if (!newProduct.name.includes(suffix)) {
              newProduct.name += suffix
            }
          }
        }

        const keyExists = existingProductsMap.has(productKey) || newProductsMap.has(productKey)
        if (!keyExists) {
          localNewProducts.push(newProduct)
          newProductsMap.set(productKey, true)
          batchDuplicates.set(productKey, (batchDuplicates.get(productKey) || 0) + 1)
        } else {
          const existingId = existingProductsMap.get(productKey)

          localUpdatedProducts.push({
            id: existingId!.toString(),
            data: {
              name: newProduct.name,
              type: newProduct.type,
              print: printKey,
              finish: finishKey,
              event_types: newProduct.event_types,
              market_price: newProduct.market_price,
              low_price: newProduct.low_price,
              mid_price: newProduct.mid_price,
              high_price: newProduct.high_price,
              direct_low_price: newProduct.direct_low_price
            }
          })
        }
      }

      processedCount++
      if (processedCount % 100 === 0) {
        const elapsed = Date.now() - startTime
        const rate = processedCount / (elapsed / 1000)
        // console.log(
        //   `[processProductsAndPrices] Processed ${processedCount}/${totalSets} sets (${rate.toFixed(2)}/s)`
        // )
      }

      // Log batch duplicates if any were detected
      let duplicateCount = 0
      for (const [key, count] of batchDuplicates) {
        if (count > 1) {
          duplicateCount++
          console.log(`[processProductsAndPrices] Duplicate detected in batch - key: ${key}, count: ${count}`)
        }
      }

      if (duplicateCount === 0 && localNewProducts.length > 0) {
        // Batch processed cleanly
      }

      return {
        newProducts: localNewProducts,
        updatedProducts: localUpdatedProducts,
        productsToMigrate: localMigrations
      }
    } catch (error) {
      errors.push({ setId: set._id, error })
      return { newProducts: [], updatedProducts: [], productsToMigrate: [] }
    }
  })

  await pipeline.run()

  await pipeline.drain()

  console.time('Product Migrations')
  const productsToMigrate = []
  for (const existingProduct of existingProducts) {
    const tcgcsvId = existingProduct.external_id?.tcgcsv_id
    if (!tcgcsvId) continue

    const newSetId = productIdToNewSetMap.get(tcgcsvId)
    if (!newSetId) continue

    const currentSetId = existingProduct.set_id.toString()

    if (currentSetId !== newSetId) {
      productsToMigrate.push({
        id: existingProduct._id.toString(),
        currentSetId,
        newSetId,
        tcgcsvId,
        name: existingProduct.name
      })
    }
  }

  if (productsToMigrate.length > 0) {
    console.log(`[processProductsAndPrices] Migrating ${productsToMigrate.length} products between sets`)
    const migrationLimit = pLimit(5)
    const migrationPromises = productsToMigrate.map((migration) =>
      migrationLimit(async () => {
        const currentSet = setMap.get(migration.currentSetId)
        const newSet = setMap.get(migration.newSetId)

        console.log(
          `[processProductsAndPrices] Migrating product "${migration.name}" from set "${currentSet?.name}" to "${newSet?.name}"`
        )

        try {
          return await context.app.service('products').patch(migration.id, {
            set_id: new ObjectId(migration.newSetId)
          })
        } catch (err) {
          console.error('[processProductsAndPrices] Error migrating product', migration.id, {
            currentSet: currentSet?.name,
            newSet: newSet?.name,
            error: err
          })
        }
      })
    )

    await Promise.all(migrationPromises)
  }
  console.timeEnd('Product Migrations')

  console.time('Final Name Disambiguation Sweep')

  const duplicateGroups = await context.app.service('products').find({
    pipeline: [
      {
        $group: {
          _id: { name: '$name' },
          products: {
            $push: {
              _id: '$_id',
              name: '$name',
              tcgcsv_id: '$external_id.tcgcsv_id',
              set_id: '$set_id',
              type: '$type'
            }
          },
          uniqueTcgcsvIds: { $addToSet: '$external_id.tcgcsv_id' },
          count: { $sum: 1 }
        }
      },
      {
        $match: { 'uniqueTcgcsvIds.1': { $exists: true } }
      }
    ],
    paginate: false
  })

  const typedDuplicateGroups = duplicateGroups as unknown as DuplicateGroup[]

  for (const group of typedDuplicateGroups) {
    for (const product of group.products) {
      const setData = setMap.get(product.set_id.toString())
      if (!setData) continue

      let code = setData.code && setData.code !== '' ? setData.code : setData.name
      if (setData.name === 'The List Reprints') {
        code = ''
      }

      if (code === 'POP') {
        code = setData.name
      }

      const suffix = ` (${code})`
      if (!product.name.includes(suffix)) {
        const newName = product.name + suffix

        try {
          console.log(`Disambiguated: ${product.name} -> ${newName}`)
          await context.app.service('products').patch(product._id, {
            name: newName
          })
        } catch (error) {
          console.error(`Error updating product ${product._id}:`, error)
        }
      }
    }
  }

  console.timeEnd('Final Name Disambiguation Sweep')

  const totalDuration = Date.now() - startTime
  console.log(
    `[processProductsAndPrices] Completed. Total sets: ${processedCount}, Errors: ${errors.length}, Total duration: ${totalDuration}ms`
  )

  if (errors.length > 0) {
    console.warn(`[processProductsAndPrices] Completed with ${errors.length} errors:`)
    errors.slice(0, 10).forEach(({ setId, error }) => {
      console.warn(`  - Set ${setId}: ${error}`)
    })
    if (errors.length > 10) {
      console.warn(`  ... and ${errors.length - 10} more errors`)
    }
  }

  console.timeEnd('processProductsAndPrices Total Time')
}

/**
 * Removes leading zeros from a string, handling fractional numbers with '/'
 * @param str - The string to process
 * @returns The string with leading zeros removed
 */
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

/**
 * Determines the product type based on product data and rarity
 * @param foundProduct - The product data
 * @param rarity - The product rarity
 * @returns The determined product type
 */
const determineProductType = (foundProduct: any, rarity: string): string => {
  const { extendedData, name, url, categoryId } = foundProduct
  if (foundProduct.presaleInfo?.isPresale) return 'Presale'
  if (rarity !== '') return 'Single Cards'

  for (const [keyword, type] of typeKeywords) {
    if (name.includes(keyword)) return type
  }

  if (extendedData?.some((d: any) => d.name.includes('Number'))) return 'Single Cards'

  return 'Sealed'
}

/**
 * Builds a unique key for a product based on its attributes
 * @param tcgcsvId - The TCGCSV ID
 * @param type - Product type
 * @param collectorNumber - Collector number
 * @param rarity - Rarity
 * @param print - Print type
 * @param finish - Finish type
 * @param setId - Set ID
 * @returns A unique product key string
 */
const buildProductKey = (
  tcgcsvId: string,
  type: string,
  collectorNumber: string,
  rarity: string,
  print: string,
  finish: string,
  setId: string
): string => {
  // Unified key derivation for all types to avoid mismatches
  return `${tcgcsvId}_${collectorNumber || 'NA'}_${rarity || 'NA'}_${print || 'NA'}_${finish || 'NA'}`
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
  finish?: string
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
  event_types?: string[]
  extended_data?: ExtendedData[]
  print?: string
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

interface DuplicateGroup {
  _id: { name: string }
  products: Array<{
    _id: string
    name: string
    tcgcsv_id: number
    set_id: string
    type: string
  }>
  uniqueTcgcsvIds: number[]
  count: number
}

//if (
//   (newProduct.type === 'Single Cards' && !newProduct.name.includes('Code Card')) ||
//   (newProduct.type === 'Single Cards' &&
//     (!newProduct.name.includes('Art Card') || !newProduct.name.includes('Art Series'))) ||
//   newProduct.type === 'Single Cards - Leak' ||
//   newProduct.name.includes('Token')
// )
