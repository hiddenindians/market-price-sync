import { BadRequest } from '@feathersjs/errors'
import type { Params, ServiceInterface } from '@feathersjs/feathers'
import { ObjectId } from 'mongodb'

import type { Application } from '../../declarations'
import { deriveFinishKey, getPrintLabel, isFinishKey } from '../../utils/print-normalizer'

export interface ProductFiltersQuery {
  gameId?: string
  setId?: string
}

export interface ProductFiltersResult {
  rarities: string[]
  finishes: { key: string; label: string }[]
  prints: { key: string; label: string }[]
  events: { key: string; label: string }[]
}

export interface ProductFiltersServiceOptions {
  app: Application
}

export interface ProductFiltersParams extends Params<ProductFiltersQuery> {}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0
const titleCase = (value: string): string =>
  value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

export class ProductFiltersService<
  ServiceParams extends ProductFiltersParams = ProductFiltersParams
> implements ServiceInterface<ProductFiltersResult, never, ServiceParams, never> {
  constructor(private readonly options: ProductFiltersServiceOptions) {}

  async find(params?: ServiceParams): Promise<ProductFiltersResult> {
    const { gameId, setId } = params?.query ?? {}

    if (!gameId || !ObjectId.isValid(gameId)) {
      throw new BadRequest('A valid gameId query parameter is required')
    }

    if (setId && !ObjectId.isValid(setId)) {
      throw new BadRequest('setId must be a valid object id when provided')
    }

    const db = await this.options.app.get('mongodbClient')
    const collection = db.collection('products')

    const matchStage: Record<string, unknown> = {
      game_id: new ObjectId(gameId)
    }

    if (setId) {
      matchStage.set_id = new ObjectId(setId)
    }

    const [aggregationResult] = await collection
      .aggregate<{
        rarities: Array<{ _id: string | null }>
        prints: Array<{ _id: string | null }>
        finishes: Array<{ _id: string | null }>
        events: Array<{ _id: string | null }>
      }>([
        { $match: matchStage },
        {
          $facet: {
            rarities: [{ $match: { rarity: { $type: 'string' } } }, { $group: { _id: '$rarity' } }],
            prints: [{ $match: { print: { $type: 'string' } } }, { $group: { _id: '$print' } }],
            finishes: [{ $match: { finish: { $type: 'string' } } }, { $group: { _id: '$finish' } }],
            events: [
              { $unwind: { path: '$event_types', preserveNullAndEmptyArrays: false } },
              { $match: { event_types: { $type: 'string' } } },
              { $group: { _id: '$event_types' } }
            ]
          }
        }
      ])
      .toArray()

    const rawRarities = (aggregationResult?.rarities ?? []).map((entry) => entry?._id)
    const rarities = rawRarities.filter(isNonEmptyString).sort((a, b) => a.localeCompare(b))

    const rawFinishes = (aggregationResult?.finishes ?? []).map((entry) => entry?._id)
    const normalizedFinishKeys = rawFinishes.filter(isNonEmptyString).map((key) => deriveFinishKey(key))

    const uniqueFinishes = Array.from(new Set(normalizedFinishKeys))

    if (!uniqueFinishes.includes('base')) {
      uniqueFinishes.unshift('base')
    }

    const finishes = uniqueFinishes
      .map((key) => ({ key, label: getPrintLabel(key) }))
      .sort((a, b) => a.label.localeCompare(b.label))

    const rawPrints = (aggregationResult?.prints ?? []).map((entry) => entry?._id)
    const uniquePrints = Array.from(new Set(rawPrints.filter(isNonEmptyString))).filter(
      (key) => !isFinishKey(key) || key === 'base'
    )

    if (!uniquePrints.includes('base')) {
      uniquePrints.unshift('base')
    }

    const prints = uniquePrints
      .map((key) => ({ key, label: key === 'base' ? 'Base Variant' : getPrintLabel(key) }))
      .sort((a, b) => {
        if (a.key === 'base') return -1
        if (b.key === 'base') return 1
        return a.label.localeCompare(b.label)
      })

    const rawEvents = (aggregationResult?.events ?? []).map((entry) => entry?._id)
    const uniqueEvents = Array.from(new Set(rawEvents.filter(isNonEmptyString)))
    const events = uniqueEvents
      .map((key) => ({ key, label: titleCase(key) }))
      .sort((a, b) => a.label.localeCompare(b.label))

    return {
      rarities,
      finishes,
      prints,
      events
    }
  }
}

export const getOptions = (app: Application): ProductFiltersServiceOptions => ({ app })
