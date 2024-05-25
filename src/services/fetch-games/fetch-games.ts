// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import type { Application } from '../../declarations'
import { FetchGamesService, getOptions } from './fetch-games.class'
import { fetchGamesPath, fetchGamesMethods } from './fetch-games.shared'
export * from './fetch-games.class'

import axios from 'axios';  // Corrected import statement

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
        async () => {
          await axios.get(`https://tcgcsv.com/categories`).then(async (data: any) => {
            let d = data.data.results
            for (var i = 0; i < d.length; i++) {
              await app
                .service('games')
                .find({
                  query: {
                    'external_id.tcgcsv_id': d[i].categoryId
                  }
                })
                .then((data) => {
                  if (data.total == 0) {
                    app.service('games').create({
                      name: `${d[i].displayName}`,
                      external_id: {
                        tcgcsv_id: d[i].categoryId
                      },
                      logo: `/assets/images/logos/${d[i].name}.png`
                    })
                  }
                })
            }
          })
        }
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
