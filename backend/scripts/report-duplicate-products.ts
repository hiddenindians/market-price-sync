import type { Document } from 'mongodb'

import { app } from '../src/app'

const DEFAULT_LIMIT = Number(process.env.DUPLICATE_REPORT_LIMIT ?? '100')
const SAMPLE_SIZE = Number(process.env.DUPLICATE_SAMPLE_SIZE ?? '5')

const buildPipeline = (limit?: number): Document[] => {
  const pipeline: Document[] = [
    {
      $match: {
        'external_id.tcgcsv_id': { $type: 'number' }
      }
    },
    {
      $group: {
        _id: '$external_id.tcgcsv_id',
        count: { $sum: 1 },
        productIds: { $push: '$_id' },
        names: { $push: '$name' },
        setIds: { $addToSet: '$set_id' },
        rarities: { $addToSet: '$rarity' },
        prints: { $addToSet: '$print' },
        finishes: { $addToSet: '$finish' },
        promoTagged: {
          $sum: {
            $cond: [{ $in: ['promo', { $ifNull: ['$event_types', []] }] }, 1, 0]
          }
        },
        samples: {
          $push: {
            productId: '$_id',
            name: '$name',
            set_id: '$set_id',
            rarity: '$rarity',
            print: '$print',
            finish: '$finish',
            event_types: { $ifNull: ['$event_types', []] }
          }
        }
      }
    },
    {
      $match: {
        count: { $gt: 1 }
      }
    },
    {
      $sort: {
        count: -1
      }
    }
  ]

  if (typeof limit === 'number' && Number.isFinite(limit) && limit > 0) {
    pipeline.push({ $limit: limit })
  }

  return pipeline
}

const parseLimitArg = (): number | undefined => {
  const arg = process.argv[2]
  if (!arg) {
    return DEFAULT_LIMIT
  }

  const parsed = Number(arg)
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed
  }

  return undefined
}

const main = async () => {
  const limit = parseLimitArg()

  await app.setup()
  const db = await app.get('mongodbClient')
  const collection = db.collection('products')

  const duplicates = await collection.aggregate(buildPipeline(limit)).toArray()

  const report = duplicates.map((entry) => ({
    tcgcsvId: entry._id,
    total: entry.count,
    uniqueSets: entry.setIds?.length ?? 0,
    promoTagged: entry.promoTagged ?? 0,
    rarities: entry.rarities?.filter(Boolean) ?? [],
    prints: entry.prints?.filter(Boolean) ?? [],
    finishes: entry.finishes?.filter(Boolean) ?? [],
    productIds: entry.productIds ?? [],
    names: entry.names ?? [],
    samples: Array.isArray(entry.samples) ? entry.samples.slice(0, SAMPLE_SIZE) : []
  }))

  const payload = {
    generatedAt: new Date().toISOString(),
    totalClusters: report.length,
    limit: limit ?? null,
    sampleSize: SAMPLE_SIZE,
    entries: report
  }

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload, null, 2))
}

main()
  .catch((error) => {
    console.error('Duplicate report failed', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await app.teardown()
  })
