// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { settingsClient } from './services/settings/settings.shared'
export type {
  Settings,
  SettingsData,
  SettingsQuery,
  SettingsPatch
} from './services/settings/settings.shared'

import { pricesClient } from './services/prices/prices.shared'
export type { Prices, PricesData, PricesQuery, PricesPatch } from './services/prices/prices.shared'

import { productsClient } from './services/products/products.shared'
export type {
  Products,
  ProductsData,
  ProductsQuery,
  ProductsPatch
} from './services/products/products.shared'

import { setsClient } from './services/sets/sets.shared'
export type { Sets, SetsData, SetsQuery, SetsPatch } from './services/sets/sets.shared'

import { gamesClient } from './services/games/games.shared'
export type { Games, GamesData, GamesQuery, GamesPatch } from './services/games/games.shared'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the mps app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any,>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(userClient)
  client.configure(gamesClient)
  client.configure(setsClient)
  client.configure(productsClient)
  client.configure(pricesClient)
  client.configure(settingsClient)
  return client
}
