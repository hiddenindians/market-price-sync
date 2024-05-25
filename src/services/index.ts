import { stores } from './stores/stores'
import { fetchProductsAndPrices } from './fetch-products-and-prices/fetch-products-and-prices'
import { fetchSets } from './fetch-sets/fetch-sets'
import { fetchGames } from './fetch-games/fetch-games'
import { settings } from './settings/settings'
import { prices } from './prices/prices'
import { products } from './products/products'
import { sets } from './sets/sets'
import { games } from './games/games'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(stores)
  app.configure(fetchProductsAndPrices)
  app.configure(fetchSets)
  app.configure(fetchGames)
  app.configure(settings)
  app.configure(prices)
  app.configure(products)
  app.configure(sets)
  app.configure(games)
  app.configure(user)
  // All services will be registered here
}
