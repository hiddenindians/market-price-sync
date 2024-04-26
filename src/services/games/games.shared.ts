// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Games, GamesData, GamesPatch, GamesQuery, GamesService } from './games.class'

export type { Games, GamesData, GamesPatch, GamesQuery }

export type GamesClientService = Pick<GamesService<Params<GamesQuery>>, (typeof gamesMethods)[number]>

export const gamesPath = 'games'

export const gamesMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const gamesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(gamesPath, connection.service(gamesPath), {
    methods: gamesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [gamesPath]: GamesClientService
  }
}
