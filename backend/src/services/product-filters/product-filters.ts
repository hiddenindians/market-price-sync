import { authenticate } from '@feathersjs/authentication'

import type { Application } from '../../declarations'
import { ProductFiltersService, getOptions } from './product-filters.class'
import { productFiltersPath, productFiltersMethods } from './product-filters.shared'

export * from './product-filters.class'

export const productFilters = (app: Application) => {
  app.use(productFiltersPath, new ProductFiltersService(getOptions(app)), {
    methods: productFiltersMethods,
    events: []
  })

  app.service(productFiltersPath).hooks({
    around: {
      all: [authenticate('jwt')]
    },
    before: {
      find: []
    },
    after: {
      find: []
    },
    error: {
      find: []
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [productFiltersPath]: ProductFiltersService
  }
}
