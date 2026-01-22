import assert from 'assert'
import { ObjectId } from 'mongodb'
import { describe, beforeEach, afterEach, it } from 'mocha'

import { app } from '../../../src/app'

const collectionName = 'products'

describe('product-filters service', () => {
  const gameId = new ObjectId()
  const setId = new ObjectId()
  const otherSetId = new ObjectId()
  const productIds: ObjectId[] = []

  beforeEach(async () => {
    const db = await app.get('mongodbClient')
    const collection = db.collection(collectionName)

    const now = Date.now()

    const docs = [
      {
        _id: new ObjectId(),
        game_id: gameId,
        set_id: setId,
        external_id: { tcgcsv_id: 1001 },
        name: 'Filter Test Base',
        short_name: 'Filter Test Base',
        type: 'Single Cards',
        last_updated: now,
        rarity: 'Common',
        print: 'base'
      },
      {
        _id: new ObjectId(),
        game_id: gameId,
        set_id: setId,
        external_id: { tcgcsv_id: 1002 },
        name: 'Filter Test Foil',
        short_name: 'Filter Test Foil',
        type: 'Single Cards',
        last_updated: now,
        rarity: 'Rare',
        print: 'foil'
      },
      {
        _id: new ObjectId(),
        game_id: gameId,
        set_id: otherSetId,
        external_id: { tcgcsv_id: 1003 },
        name: 'Filter Test Alt',
        short_name: 'Filter Test Alt',
        type: 'Single Cards',
        last_updated: now,
        rarity: 'Uncommon',
        print: 'alternate_art'
      }
    ]

    productIds.splice(0, productIds.length, ...docs.map((doc) => doc._id))

    await collection.insertMany(docs)
  })

  afterEach(async () => {
    const db = await app.get('mongodbClient')
    const collection = db.collection(collectionName)
    await collection.deleteMany({ _id: { $in: productIds } })
  })

  it('registered the service', () => {
    const service = app.service('products/filters')
    assert.ok(service, 'Registered the service')
  })

  it('returns distinct rarities and prints for a game', async () => {
    const result = await app.service('products/filters').find({
      query: { gameId: gameId.toString() }
    })

    assert.deepStrictEqual(result.rarities.sort(), ['Common', 'Rare', 'Uncommon'].sort())
    const printKeys = result.prints.map((p: { key: string }) => p.key)
    assert.ok(printKeys.includes('base'))
    assert.ok(printKeys.includes('foil'))
    assert.ok(printKeys.includes('alternate_art'))
  })

  it('filters by set when setId is supplied', async () => {
    const result = await app.service('products/filters').find({
      query: { gameId: gameId.toString(), setId: setId.toString() }
    })

    assert.deepStrictEqual(result.rarities.sort(), ['Common', 'Rare'].sort())
    const printKeys = result.prints.map((p: { key: string }) => p.key)
    assert.ok(printKeys.includes('base'))
    assert.ok(printKeys.includes('foil'))
    assert.ok(!printKeys.includes('alternate_art'))
  })
})
