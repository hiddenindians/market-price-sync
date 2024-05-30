// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  pricesDataValidator,
  pricesPatchValidator,
  pricesQueryValidator,
  pricesResolver,
  pricesExternalResolver,
  pricesDataResolver,
  pricesPatchResolver,
  pricesQueryResolver
} from './prices.schema'

import type { Application } from '../../declarations'
import { PricesService, getOptions } from './prices.class'
import { pricesPath, pricesMethods } from './prices.shared'

export * from './prices.class'
export * from './prices.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const prices = (app: Application) => {
  // Register our service on the Feathers application
  app.use(pricesPath, new PricesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: pricesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(pricesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(pricesExternalResolver),
        schemaHooks.resolveResult(pricesResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(pricesQueryValidator), schemaHooks.resolveQuery(pricesQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(pricesDataValidator), schemaHooks.resolveData(pricesDataResolver)],
      patch: [schemaHooks.validateData(pricesPatchValidator), schemaHooks.resolveData(pricesPatchResolver)],
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
    [pricesPath]: PricesService
  }
}
