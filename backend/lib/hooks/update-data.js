"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.combinedHook = void 0;
const p_limit_1 = __importDefault(require("p-limit"));
const mongodb_1 = require("mongodb");
const print_normalizer_1 = require("../utils/print-normalizer");
const concurrent_pipeline_1 = require("../utils/concurrent-pipeline");
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
]);
// Update these keyword lists whenever new naming patterns should count as events or promos.
const EVENT_KEYWORD_BUCKETS = {
    anniversary: ['Anniversary Tournament'],
    preRelease: ['Pre-Release', 'Prerelease'],
    release: ['Release Event'],
    general: ['Finalist', 'Championship', 'Participant', 'New Year Event', '3-on-3 Cup', 'Treasure Cup']
};
const PROMO_KEYWORDS = ['Promo', 'Promos', 'Promo Pack', 'Promotional', 'Tournament Pack', 'Secret Lair', 'SDCC'];
const tokenize = (value) => (value ?? '')
    .toString()
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
const containsKeywordSequence = (sourceTokens, keywordTokens) => {
    if (!sourceTokens.length || !keywordTokens.length) {
        return false;
    }
    if (keywordTokens.length === 1) {
        return sourceTokens.includes(keywordTokens[0]);
    }
    for (let i = 0; i <= sourceTokens.length - keywordTokens.length; i += 1) {
        let matches = true;
        for (let j = 0; j < keywordTokens.length; j += 1) {
            if (sourceTokens[i + j] !== keywordTokens[j]) {
                matches = false;
                break;
            }
        }
        if (matches) {
            return true;
        }
    }
    return false;
};
const keywordMatch = (sources, keywords) => {
    if (!Array.isArray(sources) || !Array.isArray(keywords) || keywords.length === 0) {
        return false;
    }
    const sourceTokenSets = sources
        .map((source) => tokenize(source))
        .filter((tokens) => tokens.length > 0);
    if (!sourceTokenSets.length) {
        return false;
    }
    const keywordTokenSets = keywords
        .map((keyword) => tokenize(keyword))
        .filter((tokens) => tokens.length > 0);
    if (!keywordTokenSets.length) {
        return false;
    }
    return keywordTokenSets.some((keywordTokens) => sourceTokenSets.some((sourceTokens) => containsKeywordSequence(sourceTokens, keywordTokens)));
};
// --- Rate limiter & metrics for external API calls ---
const RATE_LIMIT = Number(process.env.TCGCSV_RATE_LIMIT || '10');
const rateLimitedAxios = (0, concurrent_pipeline_1.createRateLimitedAxios)(RATE_LIMIT);
setInterval(() => {
    console.info(`[rate] limit: ${RATE_LIMIT}/s`);
}, 5000);
const rateLimitedGet = async (url, opts) => {
    return rateLimitedAxios.get(url, opts);
};
// --- end rate limiter ---
// Main combined hook function
const combinedHook = async (context) => {
    console.time('Total Execution Time');
    console.log(`Running combined hook on ${context.path}.${context.method}`);
    console.time('fetchGames');
    await fetchGames(context);
    console.timeEnd('fetchGames');
    // Note: fetchGames will use rateLimitedGet to avoid exceeding API rate limits.
    console.time('fetchSets');
    await fetchSets(context);
    console.timeEnd('fetchSets');
    console.time('processProductsAndPrices');
    await processProductsAndPrices(context);
    console.timeEnd('processProductsAndPrices');
    console.timeEnd('Total Execution Time');
};
exports.combinedHook = combinedHook;
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
const fetchGames = async (context) => {
    console.log('fetching games');
    const response = await rateLimitedGet(`https://tcgcsv.com/tcgplayer/categories`);
    const games = response.results;
    const existingGames = await context.app.service('games').find({ query: {}, paginate: false });
    const existingGameIds = new Set(existingGames.map((g) => g.external_id.tcgcsv_id));
    const newGames = games
        .filter((game) => !existingGameIds.has(Number(game.categoryId)) && ![21, 69, 70, 82].includes(Number(game.categoryId)))
        .map((game) => ({
        name: game.displayName,
        external_id: { tcgcsv_id: game.categoryId },
        logo: `/assets/images/logos/${game.name}.png`
    }));
    if (newGames.length > 0) {
        await context.app.service('games').create(newGames);
    }
};
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
const fetchSets = async (context) => {
    console.log('fetching sets');
    const games = await context.app.service('games').find({ query: {}, paginate: false });
    const errors = [];
    const newSets = [];
    const setsToUpdate = [];
    let processedCount = 0;
    const totalGames = games.length;
    const startTime = Date.now();
    console.log(`[fetchSets] Starting to fetch sets for ${totalGames} games`);
    const pipeline = new concurrent_pipeline_1.ConcurrentPipeline({
        fetchConcurrency: 5,
        processConcurrency: 5,
        dbConcurrency: 3,
        dbBatchSize: 2000,
        rateLimit: RATE_LIMIT
    });
    pipeline.setContext(context);
    for (const game of games) {
        pipeline.addFetchTask(async () => {
            const fetchStartTime = Date.now();
            try {
                const response = await rateLimitedGet(`https://tcgcsv.com/tcgplayer/${game.external_id.tcgcsv_id}/groups`);
                const duration = Date.now() - fetchStartTime;
                console.log(`[fetchSets] Fetched groups for game ${game.external_id.tcgcsv_id} (${game.name}) - ${response.results?.length || 0} groups in ${duration}ms`);
                return { game, groups: response.results || [] };
            }
            catch (error) {
                console.error(`[fetchSets] Error fetching groups for game ${game.external_id.tcgcsv_id}:`, error);
                throw error;
            }
        });
    }
    pipeline.onProcess(async ({ game, groups }) => {
        try {
            const existingSetsResult = await context.app.service('sets').find({
                query: { game_id: game._id },
                paginate: false
            });
            const existingSets = existingSetsResult.data || existingSetsResult;
            const existingSetMap = new Map(existingSets.map((s) => [s.external_id.tcgcsv_id, s]));
            const localNewSets = [];
            const localSetsToUpdate = [];
            for (const group of groups) {
                const groupId = Number(group.groupId);
                const existingSet = existingSetMap.get(groupId);
                if (existingSet) {
                    const needsUpdate = existingSet.name !== group.name ||
                        existingSet.code !== (group.abbreviation || '');
                    if (needsUpdate) {
                        localSetsToUpdate.push({
                            id: existingSet._id,
                            data: {
                                name: group.name,
                                code: group.abbreviation || ''
                            }
                        });
                    }
                }
                else {
                    localNewSets.push({
                        game_id: game._id,
                        name: group.name,
                        code: group.abbreviation || '',
                        external_id: { tcgcsv_id: groupId }
                    });
                }
            }
            newSets.push(...localNewSets);
            setsToUpdate.push(...localSetsToUpdate);
            processedCount++;
            if (processedCount % 20 === 0) {
                const elapsed = Date.now() - startTime;
                const rate = processedCount / (elapsed / 1000);
                console.log(`[fetchSets] Processed ${processedCount}/${totalGames} games (${rate.toFixed(2)}/s), collected ${newSets.length} new sets, ${setsToUpdate.length} updates`);
            }
            return { newProducts: [], updatedProducts: [], productsToMigrate: [] };
        }
        catch (error) {
            errors.push({ gameId: game.external_id.tcgcsv_id, error });
            return { newProducts: [], updatedProducts: [], productsToMigrate: [] };
        }
    });
    await pipeline.run();
    await pipeline.drain();
    if (errors.length > 0) {
        console.warn(`[fetchSets] Completed with ${errors.length} errors:`);
        errors.forEach(({ gameId, error }) => {
            console.warn(`  - Game ${gameId}: ${error}`);
        });
    }
    const createStartTime = Date.now();
    if (newSets.length > 0) {
        console.log(`[fetchSets] Creating ${newSets.length} new sets`);
        await context.app.service('sets').create(newSets);
    }
    if (setsToUpdate.length > 0) {
        console.log(`[fetchSets] Updating ${setsToUpdate.length} existing sets`);
        const updatePromises = setsToUpdate.map(({ id, data }) => context.app.service('sets').patch(id, data));
        await Promise.all(updatePromises);
    }
    const totalDuration = Date.now() - startTime;
    console.log(`[fetchSets] Completed. New: ${newSets.length}, Updated: ${setsToUpdate.length}, Errors: ${errors.length}, Total duration: ${totalDuration}ms`);
};
const parseNumberOrString = (input) => {
    const parsedNumber = parseFloat(input);
    // Check if parsedNumber is a valid number
    if (isNaN(parsedNumber)) {
        // If parsing failed, return the original string
        return input;
    }
    // If parsing succeeded, return the number
    return parsedNumber;
};
const extractProductData = (foundProduct) => {
    const dataArray = [];
    const newProduct = {};
    const extendedDataMap = new Map();
    if (foundProduct.extendedData) {
        for (const data of foundProduct.extendedData) {
            extendedDataMap.set(data.name, data.value);
            dataArray.push({
                name: data.name,
                display_name: data.displayName,
                value: data.value
            });
        }
    }
    newProduct.collector_number = extendedDataMap.get('Number') || '';
    newProduct.sort_number = parseNumberOrString(newProduct.collector_number) || newProduct.collector_number;
    newProduct.rarity = extendedDataMap.get('Rarity') || '';
    newProduct.extended_data = dataArray;
    newProduct.set_id = foundProduct.set_id;
    newProduct.game_id = foundProduct.game_id;
    newProduct.external_id = {
        tcgcsv_id: Number(foundProduct.productId),
        tcgcsv_category_id: Number(foundProduct.categoryId),
        tcgcsv_group_id: Number(foundProduct.groupId)
    };
    newProduct.short_name = `${foundProduct.name}`;
    newProduct.name = `${foundProduct.name}`;
    newProduct.image_url = `${foundProduct.imageUrl.slice(0, -8)}400w.jpg`;
    newProduct.type = determineProductType(foundProduct, newProduct.rarity || '');
    newProduct.last_updated = Date.now();
    newProduct.print = 'base';
    newProduct.finish = 'base';
    return newProduct;
};
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
const processProductsAndPrices = async (context) => {
    console.log(`Running processProductsAndPrices on ${context.path}.${context.method}`);
    console.time('processProductsAndPrices Total Time');
    console.time('Initial Data Fetch');
    const [sets, games, existingProducts] = await Promise.all([
        context.app.service('sets').find({ query: {}, paginate: false }),
        context.app.service('games').find({ query: {}, paginate: false }),
        context.app.service('products').find({ query: {}, paginate: false })
    ]);
    console.timeEnd('Initial Data Fetch');
    const gameIdMap = new Map(games.map((game) => [game._id.toString(), game.external_id.tcgcsv_id]));
    const setMap = new Map(sets.map((set) => [set._id.toString(), set]));
    const existingProductsMap = new Map();
    existingProducts.forEach((p) => {
        const name = p.name;
        const extId = p.external_id?.tcgcsv_id?.toString();
        if (!name || !extId)
            return;
        if (!existingProductsMap.has(name)) {
            existingProductsMap.set(name, new Map());
        }
        existingProductsMap.get(name).set(extId, p._id);
    });
    const newProductsMap = new Map();
    const errors = [];
    let processedCount = 0;
    const totalSets = sets.length;
    const startTime = Date.now();
    console.log(`[processProductsAndPrices] Starting concurrent pipeline for ${totalSets} sets`);
    const pipeline = new concurrent_pipeline_1.ConcurrentPipeline({
        fetchConcurrency: 10,
        processConcurrency: 10,
        dbConcurrency: 5,
        dbBatchSize: 2000,
        rateLimit: RATE_LIMIT
    });
    pipeline.setContext(context);
    const productIdToNewSetMap = new Map();
    for (const set of sets) {
        pipeline.addFetchTask(async () => {
            const fetchStartTime = Date.now();
            const gameId = gameIdMap.get(set.game_id.toString());
            if (!gameId) {
                throw new Error(`No game ID found for set ${set._id}`);
            }
            try {
                const [productResponse, priceResponse] = await Promise.all([
                    rateLimitedGet(`https://tcgcsv.com/tcgplayer/${gameId}/${set.external_id.tcgcsv_id}/products`),
                    rateLimitedGet(`https://tcgcsv.com/tcgplayer/${gameId}/${set.external_id.tcgcsv_id}/prices`)
                ]);
                const productData = productResponse.results || [];
                const priceData = priceResponse.results || [];
                const products = productData.map((p) => {
                    const sources = [set.name ?? '', set.code ?? '', p.name ?? ''];
                    const anniversary = keywordMatch(sources, EVENT_KEYWORD_BUCKETS.anniversary);
                    const preRelease = keywordMatch(sources, EVENT_KEYWORD_BUCKETS.preRelease);
                    const release = keywordMatch(sources, EVENT_KEYWORD_BUCKETS.release);
                    const genericEvent = keywordMatch(sources, EVENT_KEYWORD_BUCKETS.general);
                    const promo = keywordMatch(sources, PROMO_KEYWORDS);
                    return {
                        ...p,
                        game_id: set.game_id,
                        set_id: set._id,
                        anniversary,
                        pre_release: preRelease,
                        release,
                        event_keyword: genericEvent,
                        promo
                    };
                });
                const duration = Date.now() - fetchStartTime;
                console.log(`[processProductsAndPrices] Fetched set ${set._id} (${set.name}) - ${products.length} products, ${priceData.length} prices in ${duration}ms`);
                return { set, products, prices: priceData };
            }
            catch (error) {
                console.error(`[processProductsAndPrices] Error fetching data for set ${set._id}:`, error);
                throw error;
            }
        });
    }
    pipeline.onProcess(async ({ set, products, prices }) => {
        const localNewProducts = [];
        const localUpdatedProducts = [];
        const localMigrations = [];
        try {
            for (const prod of products) {
                productIdToNewSetMap.set(prod.productId, prod.set_id.toString());
            }
            const productMap = new Map();
            for (const prod of products) {
                productMap.set(prod.productId, prod);
            }
            for (const price of prices) {
                const prod = productMap.get(price.productId);
                if (!prod)
                    continue;
                let newProduct = extractProductData(prod);
                const finishInfo = (0, print_normalizer_1.normalizePrint)(price.subTypeName);
                const finishKey = (0, print_normalizer_1.deriveFinishKey)(finishInfo.key);
                const finishVariantKey = (0, print_normalizer_1.isFoilVariantKey)(finishInfo.key) ? finishInfo.key : null;
                const variantInfo = (0, print_normalizer_1.detectPrintVariant)({
                    name: prod.name,
                    short_name: prod.cleanName ?? prod.name,
                    extended_data: newProduct.extended_data
                });
                let printKey = variantInfo.key;
                if (!printKey || printKey === 'base' || (0, print_normalizer_1.isFinishKey)(printKey)) {
                    printKey = finishVariantKey ?? 'base';
                }
                newProduct.print = printKey;
                newProduct.finish = finishKey;
                const extIdStr = newProduct.external_id.tcgcsv_id.toString();
                const eventSuffixes = [
                    { condition: prod.pre_release, suffix: '(Pre-Release Event)', keywords: EVENT_KEYWORD_BUCKETS.preRelease },
                    { condition: prod.release, suffix: '(Release Event)', keywords: EVENT_KEYWORD_BUCKETS.release },
                    { condition: prod.anniversary, suffix: '(Anniversary Event)', keywords: EVENT_KEYWORD_BUCKETS.anniversary },
                    { condition: prod.promo && newProduct.rarity !== 'Promo', suffix: '(Promo)', keywords: PROMO_KEYWORDS }
                ];
                for (const { condition, suffix, keywords } of eventSuffixes) {
                    if (condition) {
                        const alreadyHasKeyword = keywordMatch([newProduct.name], keywords);
                        const alreadyHasSuffix = newProduct.name.toLowerCase().includes(suffix.toLowerCase());
                        if (!alreadyHasKeyword && !alreadyHasSuffix) {
                            newProduct.name += ` ${suffix}`;
                        }
                    }
                }
                newProduct.market_price = price.marketPrice ? Number(price.marketPrice) : -1;
                newProduct.low_price = price.lowPrice ? Number(price.lowPrice) : -1;
                newProduct.mid_price = price.midPrice ? Number(price.midPrice) : -1;
                newProduct.high_price = price.highPrice ? Number(price.highPrice) : -1;
                newProduct.direct_low_price = price.directLowPrice ? Number(price.directLowPrice) : -1;
                const eventTypes = [];
                if (prod.pre_release)
                    eventTypes.push('pre_release');
                if (prod.release)
                    eventTypes.push('release');
                if (prod.anniversary)
                    eventTypes.push('anniversary');
                if (prod.event_keyword)
                    eventTypes.push('event');
                if (prod.promo)
                    eventTypes.push('promo');
                newProduct.event_types = eventTypes;
                const rarityText = newProduct.rarity ? `, ${newProduct.rarity}` : '';
                if ((newProduct.type === 'Single Cards' && !newProduct.name.includes('Code Card')) ||
                    newProduct.type === 'Presale' ||
                    newProduct.name.includes('Token')) {
                    if (newProduct.collector_number === undefined ||
                        newProduct.name.includes(removeLeadingZeros(newProduct.collector_number))) {
                        newProduct.name += ` (${price.subTypeName}${rarityText})`;
                    }
                    else if (newProduct.collector_number !== undefined) {
                        newProduct.name += ` - ${newProduct.collector_number} (${price.subTypeName}${rarityText})`;
                    }
                }
                const setData = setMap.get(newProduct.set_id.toString());
                if (setData && setData.name === 'The List Reprints' && !newProduct.name.includes('(LIST)')) {
                    newProduct.name += ' (LIST)';
                }
                const nameExists = existingProductsMap.has(newProduct.name) || newProductsMap.has(newProduct.name);
                if (!nameExists) {
                    localNewProducts.push(newProduct);
                    newProductsMap.set(newProduct.name, new Map([[extIdStr, true]]));
                }
                else {
                    const extMapExisting = existingProductsMap.get(newProduct.name);
                    const extMapNew = newProductsMap.get(newProduct.name);
                    const compositeExists = (extMapExisting && extMapExisting.has(extIdStr)) ||
                        (extMapNew && extMapNew.has(extIdStr));
                    if (compositeExists) {
                        let existingId = extMapExisting.get(extIdStr);
                        localUpdatedProducts.push({
                            id: existingId.toString(),
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
                        });
                    }
                    else {
                        if (setData) {
                            let code = setData.code && setData.code !== '' ? setData.code : setData.name;
                            if (setData.name === 'The List Reprints') {
                                code = '';
                            }
                            if (code === 'POP') {
                                code = setData.name;
                            }
                            newProduct.name += ` (${code})`;
                        }
                        const newCompositeExists = (existingProductsMap.has(newProduct.name) &&
                            existingProductsMap.get(newProduct.name).has(extIdStr)) ||
                            (newProductsMap.has(newProduct.name) &&
                                newProductsMap.get(newProduct.name).has(extIdStr));
                        if (newCompositeExists) {
                            let existingId = existingProductsMap
                                .get(newProduct.name)
                                ?.get(extIdStr);
                            localUpdatedProducts.push({
                                id: existingId.toString(),
                                data: {
                                    name: newProduct.name,
                                    type: newProduct.type,
                                    print: printKey,
                                    finish: finishKey,
                                    event_types: newProduct.event_types,
                                    market_price: price.marketPrice ? Number(price.marketPrice) : -1,
                                    low_price: price.lowPrice ? Number(price.lowPrice) : -1,
                                    mid_price: price.midPrice ? Number(price.midPrice) : -1,
                                    high_price: price.highPrice ? Number(price.highPrice) : -1,
                                    direct_low_price: price.directLowPrice ? Number(price.directLowPrice) : -1
                                }
                            });
                            if (!newProductsMap.has(newProduct.name)) {
                                newProductsMap.set(newProduct.name, new Map());
                            }
                            newProductsMap.get(newProduct.name).set(extIdStr, true);
                        }
                        else {
                            localNewProducts.push(newProduct);
                            if (!newProductsMap.has(newProduct.name)) {
                                newProductsMap.set(newProduct.name, new Map());
                            }
                            newProductsMap.get(newProduct.name).set(extIdStr, true);
                        }
                    }
                }
            }
            processedCount++;
            if (processedCount % 100 === 0) {
                const elapsed = Date.now() - startTime;
                const rate = processedCount / (elapsed / 1000);
                console.log(`[processProductsAndPrices] Processed ${processedCount}/${totalSets} sets (${rate.toFixed(2)}/s)`);
            }
            return {
                newProducts: localNewProducts,
                updatedProducts: localUpdatedProducts,
                productsToMigrate: localMigrations
            };
        }
        catch (error) {
            errors.push({ setId: set._id, error });
            return { newProducts: [], updatedProducts: [], productsToMigrate: [] };
        }
    });
    await pipeline.run();
    await pipeline.drain();
    console.time('Product Migrations');
    const productsToMigrate = [];
    for (const existingProduct of existingProducts) {
        const tcgcsvId = existingProduct.external_id?.tcgcsv_id;
        if (!tcgcsvId)
            continue;
        const newSetId = productIdToNewSetMap.get(tcgcsvId);
        if (!newSetId)
            continue;
        const currentSetId = existingProduct.set_id.toString();
        if (currentSetId !== newSetId) {
            productsToMigrate.push({
                id: existingProduct._id.toString(),
                currentSetId,
                newSetId,
                tcgcsvId,
                name: existingProduct.name
            });
        }
    }
    if (productsToMigrate.length > 0) {
        console.log(`[processProductsAndPrices] Migrating ${productsToMigrate.length} products between sets`);
        const migrationLimit = (0, p_limit_1.default)(5);
        const migrationPromises = productsToMigrate.map(migration => migrationLimit(async () => {
            const currentSet = setMap.get(migration.currentSetId);
            const newSet = setMap.get(migration.newSetId);
            console.log(`[processProductsAndPrices] Migrating product "${migration.name}" from set "${currentSet?.name}" to "${newSet?.name}"`);
            try {
                return await context.app.service('products').patch(migration.id, {
                    set_id: new mongodb_1.ObjectId(migration.newSetId)
                });
            }
            catch (err) {
                console.error('[processProductsAndPrices] Error migrating product', migration.id, { currentSet: currentSet?.name, newSet: newSet?.name, error: err });
            }
        }));
        await Promise.all(migrationPromises);
    }
    console.timeEnd('Product Migrations');
    const totalDuration = Date.now() - startTime;
    console.log(`[processProductsAndPrices] Completed. Total sets: ${processedCount}, Errors: ${errors.length}, Total duration: ${totalDuration}ms`);
    if (errors.length > 0) {
        console.warn(`[processProductsAndPrices] Completed with ${errors.length} errors:`);
        errors.slice(0, 10).forEach(({ setId, error }) => {
            console.warn(`  - Set ${setId}: ${error}`);
        });
        if (errors.length > 10) {
            console.warn(`  ... and ${errors.length - 10} more errors`);
        }
    }
    console.timeEnd('processProductsAndPrices Total Time');
};
const removeLeadingZeros = (str) => {
    if (str == undefined) {
        return 'undefined';
    }
    // Check if it contains a '/'
    if (str.includes('/')) {
        // Normalize both parts if there's a '/'
        const parts = str.split('/');
        return parts.map((part) => part.replace(/^0+/, '')).join('/');
    }
    else {
        // Otherwise just remove leading zeros from the single number
        return str.replace(/^0+/, '');
    }
};
const determineProductType = (foundProduct, rarity) => {
    const { extendedData, name, url, categoryId } = foundProduct;
    if (foundProduct.presaleInfo?.isPresale)
        return 'Presale';
    if (rarity !== '')
        return 'Single Cards';
    for (const [keyword, type] of typeKeywords) {
        if (name.includes(keyword))
            return type;
    }
    if (extendedData?.some((d) => d.name.includes('Number')))
        return 'Single Cards';
    return 'Sealed'; // Default fallback
};
//if (
//   (newProduct.type === 'Single Cards' && !newProduct.name.includes('Code Card')) ||
//   (newProduct.type === 'Single Cards' &&
//     (!newProduct.name.includes('Art Card') || !newProduct.name.includes('Art Series'))) ||
//   newProduct.type === 'Single Cards - Leak' ||
//   newProduct.name.includes('Token')
// )
//# sourceMappingURL=update-data.js.map