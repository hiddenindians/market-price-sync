// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import type { Application } from '../../declarations'
import { FetchGamesService, getOptions } from './fetch-games.class'
import { fetchGamesPath, fetchGamesMethods } from './fetch-games.shared'
export * from './fetch-games.class'

import axios from 'axios';  // Corrected import statement
import { combinedHook } from '../../hooks/update-data'

// A configure function that registers the service and its hooks via `app.configure`
export const fetchGames = (app: Application) => {
  // Register our service on the Feathers application
  app.use(fetchGamesPath, new FetchGamesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: fetchGamesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(fetchGamesPath).hooks({
    around: {
      all: [authenticate('jwt')]
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [
       combinedHook
      ],
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
    [fetchGamesPath]: FetchGamesService
  }
}
