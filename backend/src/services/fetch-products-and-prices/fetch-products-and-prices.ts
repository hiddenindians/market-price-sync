// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import type { Application } from '../../declarations'
import { FetchProductsAndPricesService, getOptions } from './fetch-products-and-prices.class'
import { fetchProductsAndPricesPath, fetchProductsAndPricesMethods } from './fetch-products-and-prices.shared'

export * from './fetch-products-and-prices.class'

// A configure function that registers the service and its hooks via `app.configure`
export const fetchProductsAndPrices = (app: Application) => {
  // Register our service on the Feathers application
  app.use(fetchProductsAndPricesPath, new FetchProductsAndPricesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: fetchProductsAndPricesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(fetchProductsAndPricesPath).hooks({
    around: {
      all: [authenticate('jwt')]
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [fetchProductsAndPricesPath]: FetchProductsAndPricesService
  }
}
