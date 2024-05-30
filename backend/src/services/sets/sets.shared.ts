// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Sets, SetsData, SetsPatch, SetsQuery, SetsService } from './sets.class'

export type { Sets, SetsData, SetsPatch, SetsQuery }

export type SetsClientService = Pick<SetsService<Params<SetsQuery>>, (typeof setsMethods)[number]>

export const setsPath = 'sets'

export const setsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const setsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(setsPath, connection.service(setsPath), {
    methods: setsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [setsPath]: SetsClientService
  }
}
