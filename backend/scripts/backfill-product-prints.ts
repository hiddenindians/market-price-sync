import type { Products } from '../src/services/products/products.schema'
import { app } from '../src/app'
import { derivePrintFromProduct } from '../src/utils/print-normalizer'

const BATCH_SIZE = 500

const needsBackfill = (product: Products): boolean => {
  if (!('print' in product)) {
    return true
  }
  const value = (product as any).print
  return value === undefined || value === null || value === ''
}

const main = async () => {
  await app.setup()
  const service = app.service('products')

  let processed = 0
  let updated = 0

  while (true) {
    const response = await service.find({
      paginate: false,
      query: {
        $limit: BATCH_SIZE,
        $or: [{ print: { $exists: false } }, { print: null }, { print: '' }]
      }
    })

    const batch = Array.isArray(response) ? (response as Products[]) : (response.data as Products[])

    if (batch.length === 0) {
      break
    }

    for (const product of batch) {
      processed += 1
      if (!needsBackfill(product)) {
        continue
      }

      const { key } = derivePrintFromProduct(product)
      await service.patch(product._id as string, { print: key })
      updated += 1
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Backfill complete. Examined ${processed} products, updated ${updated}.`)
}

main()
  .catch((error) => {
    console.error('Backfill failed', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await app.teardown()
  })
