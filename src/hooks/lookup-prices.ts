// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const lookupPrices = async (context: HookContext) => {
  console.log(`Running hook lookup-prices on ${context.path}.${context.method}`)
  // console.log(context.arguments)

      context.params.pipeline = [
        {
          $lookup: {
            from: 'prices',
            localField: '_id',
            foreignField: 'product_id',
            as: 'market_price',
            // pipeline: [{
            //   $sort: {timestamp: 1}
            // }

            // ]
          }
        },
        //{ $unwind: { path: '$market_price' }}
      ]
}
