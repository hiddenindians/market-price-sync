// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  storesDataValidator,
  storesPatchValidator,
  storesQueryValidator,
  storesResolver,
  storesExternalResolver,
  storesDataResolver,
  storesPatchResolver,
  storesQueryResolver
} from './stores.schema'

import type { Application } from '../../declarations'
import { StoresService, getOptions } from './stores.class'
import { storesPath, storesMethods } from './stores.shared'
import { updateStoreStatus } from '../../hooks/update-store-status'

export * from './stores.class'
export * from './stores.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const stores = (app: Application) => {
  // Register our service on the Feathers application
  app.use(storesPath, new StoresService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: storesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(storesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(storesExternalResolver),
        schemaHooks.resolveResult(storesResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(storesQueryValidator), schemaHooks.resolveQuery(storesQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(storesDataValidator), schemaHooks.resolveData(storesDataResolver)],
      patch: [schemaHooks.validateData(storesPatchValidator), schemaHooks.resolveData(storesPatchResolver)],
      remove: []
    },
    after: {
      all: [],
      create: [updateStoreStatus]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [storesPath]: StoresService
  }
}
