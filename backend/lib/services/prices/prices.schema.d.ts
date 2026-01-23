import type { Static } from '@feathersjs/typebox'
import type { HookContext } from '../../declarations'
import type { PricesService } from './prices.class'
export declare const pricesSchema: import('@sinclair/typebox').TObject<{
  _id: import('@sinclair/typebox').TUnion<
    [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
  >
  product_id: import('@sinclair/typebox').TUnion<
    [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
  >
  timestamp: import('@sinclair/typebox').TNumber
  market_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
  low_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
  mid_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
  high_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
  direct_low_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
}>
export type Prices = Static<typeof pricesSchema>
export declare const pricesValidator: import('@feathersjs/schema').Validator<any, any>
export declare const pricesResolver: import('@feathersjs/schema').Resolver<
  {
    market_price?: number | undefined
    low_price?: number | undefined
    mid_price?: number | undefined
    high_price?: number | undefined
    direct_low_price?: number | undefined
    timestamp: number
    _id: string | {}
    product_id: string | {}
  },
  HookContext<PricesService<import('./prices.class').PricesParams>>
>
export declare const pricesExternalResolver: import('@feathersjs/schema').Resolver<
  {
    market_price?: number | undefined
    low_price?: number | undefined
    mid_price?: number | undefined
    high_price?: number | undefined
    direct_low_price?: number | undefined
    timestamp: number
    _id: string | {}
    product_id: string | {}
  },
  HookContext<PricesService<import('./prices.class').PricesParams>>
>
export declare const pricesDataSchema: import('@sinclair/typebox').TPick<
  import('@sinclair/typebox').TObject<{
    _id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    product_id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    timestamp: import('@sinclair/typebox').TNumber
    market_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    low_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    mid_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    high_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    direct_low_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
  }>,
  ['timestamp', 'market_price', 'product_id', 'low_price', 'mid_price', 'high_price', 'direct_low_price']
>
export type PricesData = Static<typeof pricesDataSchema>
export declare const pricesDataValidator: import('@feathersjs/schema').Validator<any, any>
export declare const pricesDataResolver: import('@feathersjs/schema').Resolver<
  {
    market_price?: number | undefined
    low_price?: number | undefined
    mid_price?: number | undefined
    high_price?: number | undefined
    direct_low_price?: number | undefined
    timestamp: number
    _id: string | {}
    product_id: string | {}
  },
  HookContext<PricesService<import('./prices.class').PricesParams>>
>
export declare const pricesPatchSchema: import('@sinclair/typebox').TPartial<
  import('@sinclair/typebox').TObject<{
    _id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    product_id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    timestamp: import('@sinclair/typebox').TNumber
    market_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    low_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    mid_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    high_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    direct_low_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
  }>
>
export type PricesPatch = Static<typeof pricesPatchSchema>
export declare const pricesPatchValidator: import('@feathersjs/schema').Validator<any, any>
export declare const pricesPatchResolver: import('@feathersjs/schema').Resolver<
  {
    market_price?: number | undefined
    low_price?: number | undefined
    mid_price?: number | undefined
    high_price?: number | undefined
    direct_low_price?: number | undefined
    timestamp: number
    _id: string | {}
    product_id: string | {}
  },
  HookContext<PricesService<import('./prices.class').PricesParams>>
>
export declare const pricesQueryProperties: import('@sinclair/typebox').TPick<
  import('@sinclair/typebox').TObject<{
    _id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    product_id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    timestamp: import('@sinclair/typebox').TNumber
    market_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    low_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    mid_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    high_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
    direct_low_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
  }>,
  ['_id', 'timestamp', 'market_price', 'product_id']
>
export declare const pricesQuerySchema: import('@sinclair/typebox').TIntersect<
  [
    import('@sinclair/typebox').TIntersect<
      [
        import('@sinclair/typebox').TPartial<
          import('@sinclair/typebox').TObject<{
            $limit: import('@sinclair/typebox').TNumber
            $skip: import('@sinclair/typebox').TNumber
            $sort: import('@sinclair/typebox').TObject<{
              timestamp: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TInteger>
              _id: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TInteger>
              product_id: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TInteger>
              market_price: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TInteger>
            }>
            $select: import('@sinclair/typebox').TUnsafe<
              ('timestamp' | '_id' | 'product_id' | 'market_price')[]
            >
            $and: import('@sinclair/typebox').TArray<
              import('@sinclair/typebox').TUnion<
                [
                  import('@sinclair/typebox').TOptional<
                    import('@sinclair/typebox').TObject<{
                      timestamp: import('@sinclair/typebox').TOptional<
                        import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TNumber,
                            import('@sinclair/typebox').TPartial<
                              import('@sinclair/typebox').TIntersect<
                                [
                                  import('@sinclair/typebox').TObject<{
                                    $gt: import('@sinclair/typebox').TNumber
                                    $gte: import('@sinclair/typebox').TNumber
                                    $lt: import('@sinclair/typebox').TNumber
                                    $lte: import('@sinclair/typebox').TNumber
                                    $ne: import('@sinclair/typebox').TNumber
                                    $in:
                                      | import('@sinclair/typebox').TNumber
                                      | import('@sinclair/typebox').TArray<
                                          import('@sinclair/typebox').TNumber
                                        >
                                    $nin:
                                      | import('@sinclair/typebox').TNumber
                                      | import('@sinclair/typebox').TArray<
                                          import('@sinclair/typebox').TNumber
                                        >
                                  }>,
                                  import('@sinclair/typebox').TObject<
                                    | {
                                        [key: string]: import('@sinclair/typebox').TSchema
                                      }
                                    | undefined
                                  >
                                ]
                              >
                            >
                          ]
                        >
                      >
                      _id: import('@sinclair/typebox').TOptional<
                        import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TUnion<
                              [
                                import('@sinclair/typebox').TString<string>,
                                import('@sinclair/typebox').TObject<{}>
                              ]
                            >,
                            import('@sinclair/typebox').TPartial<
                              import('@sinclair/typebox').TIntersect<
                                [
                                  import('@sinclair/typebox').TObject<{
                                    $gt: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $gte: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $lt: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $lte: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $ne: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $in:
                                      | import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                      | import('@sinclair/typebox').TArray<
                                          import('@sinclair/typebox').TUnion<
                                            [
                                              import('@sinclair/typebox').TString<string>,
                                              import('@sinclair/typebox').TObject<{}>
                                            ]
                                          >
                                        >
                                    $nin:
                                      | import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                      | import('@sinclair/typebox').TArray<
                                          import('@sinclair/typebox').TUnion<
                                            [
                                              import('@sinclair/typebox').TString<string>,
                                              import('@sinclair/typebox').TObject<{}>
                                            ]
                                          >
                                        >
                                  }>,
                                  import('@sinclair/typebox').TObject<
                                    | {
                                        [key: string]: import('@sinclair/typebox').TSchema
                                      }
                                    | undefined
                                  >
                                ]
                              >
                            >
                          ]
                        >
                      >
                      product_id: import('@sinclair/typebox').TOptional<
                        import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TUnion<
                              [
                                import('@sinclair/typebox').TString<string>,
                                import('@sinclair/typebox').TObject<{}>
                              ]
                            >,
                            import('@sinclair/typebox').TPartial<
                              import('@sinclair/typebox').TIntersect<
                                [
                                  import('@sinclair/typebox').TObject<{
                                    $gt: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $gte: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $lt: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $lte: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $ne: import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                    $in:
                                      | import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                      | import('@sinclair/typebox').TArray<
                                          import('@sinclair/typebox').TUnion<
                                            [
                                              import('@sinclair/typebox').TString<string>,
                                              import('@sinclair/typebox').TObject<{}>
                                            ]
                                          >
                                        >
                                    $nin:
                                      | import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                      | import('@sinclair/typebox').TArray<
                                          import('@sinclair/typebox').TUnion<
                                            [
                                              import('@sinclair/typebox').TString<string>,
                                              import('@sinclair/typebox').TObject<{}>
                                            ]
                                          >
                                        >
                                  }>,
                                  import('@sinclair/typebox').TObject<
                                    | {
                                        [key: string]: import('@sinclair/typebox').TSchema
                                      }
                                    | undefined
                                  >
                                ]
                              >
                            >
                          ]
                        >
                      >
                      market_price: import('@sinclair/typebox').TOptional<
                        import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>,
                            import('@sinclair/typebox').TPartial<
                              import('@sinclair/typebox').TIntersect<
                                [
                                  import('@sinclair/typebox').TObject<{
                                    $gt: import('@sinclair/typebox').TOptional<
                                      import('@sinclair/typebox').TNumber
                                    >
                                    $gte: import('@sinclair/typebox').TOptional<
                                      import('@sinclair/typebox').TNumber
                                    >
                                    $lt: import('@sinclair/typebox').TOptional<
                                      import('@sinclair/typebox').TNumber
                                    >
                                    $lte: import('@sinclair/typebox').TOptional<
                                      import('@sinclair/typebox').TNumber
                                    >
                                    $ne: import('@sinclair/typebox').TOptional<
                                      import('@sinclair/typebox').TNumber
                                    >
                                    $in:
                                      | import('@sinclair/typebox').TOptional<
                                          import('@sinclair/typebox').TNumber
                                        >
                                      | import('@sinclair/typebox').TArray<
                                          import('@sinclair/typebox').TOptional<
                                            import('@sinclair/typebox').TNumber
                                          >
                                        >
                                    $nin:
                                      | import('@sinclair/typebox').TOptional<
                                          import('@sinclair/typebox').TNumber
                                        >
                                      | import('@sinclair/typebox').TArray<
                                          import('@sinclair/typebox').TOptional<
                                            import('@sinclair/typebox').TNumber
                                          >
                                        >
                                  }>,
                                  import('@sinclair/typebox').TObject<
                                    | {
                                        [key: string]: import('@sinclair/typebox').TSchema
                                      }
                                    | undefined
                                  >
                                ]
                              >
                            >
                          ]
                        >
                      >
                    }>
                  >,
                  import('@sinclair/typebox').TObject<{
                    $or: import('@sinclair/typebox').TArray<
                      import('@sinclair/typebox').TOptional<
                        import('@sinclair/typebox').TObject<{
                          timestamp: import('@sinclair/typebox').TOptional<
                            import('@sinclair/typebox').TUnion<
                              [
                                import('@sinclair/typebox').TNumber,
                                import('@sinclair/typebox').TPartial<
                                  import('@sinclair/typebox').TIntersect<
                                    [
                                      import('@sinclair/typebox').TObject<{
                                        $gt: import('@sinclair/typebox').TNumber
                                        $gte: import('@sinclair/typebox').TNumber
                                        $lt: import('@sinclair/typebox').TNumber
                                        $lte: import('@sinclair/typebox').TNumber
                                        $ne: import('@sinclair/typebox').TNumber
                                        $in:
                                          | import('@sinclair/typebox').TNumber
                                          | import('@sinclair/typebox').TArray<
                                              import('@sinclair/typebox').TNumber
                                            >
                                        $nin:
                                          | import('@sinclair/typebox').TNumber
                                          | import('@sinclair/typebox').TArray<
                                              import('@sinclair/typebox').TNumber
                                            >
                                      }>,
                                      import('@sinclair/typebox').TObject<
                                        | {
                                            [key: string]: import('@sinclair/typebox').TSchema
                                          }
                                        | undefined
                                      >
                                    ]
                                  >
                                >
                              ]
                            >
                          >
                          _id: import('@sinclair/typebox').TOptional<
                            import('@sinclair/typebox').TUnion<
                              [
                                import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >,
                                import('@sinclair/typebox').TPartial<
                                  import('@sinclair/typebox').TIntersect<
                                    [
                                      import('@sinclair/typebox').TObject<{
                                        $gt: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $gte: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $lt: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $lte: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $ne: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $in:
                                          | import('@sinclair/typebox').TUnion<
                                              [
                                                import('@sinclair/typebox').TString<string>,
                                                import('@sinclair/typebox').TObject<{}>
                                              ]
                                            >
                                          | import('@sinclair/typebox').TArray<
                                              import('@sinclair/typebox').TUnion<
                                                [
                                                  import('@sinclair/typebox').TString<string>,
                                                  import('@sinclair/typebox').TObject<{}>
                                                ]
                                              >
                                            >
                                        $nin:
                                          | import('@sinclair/typebox').TUnion<
                                              [
                                                import('@sinclair/typebox').TString<string>,
                                                import('@sinclair/typebox').TObject<{}>
                                              ]
                                            >
                                          | import('@sinclair/typebox').TArray<
                                              import('@sinclair/typebox').TUnion<
                                                [
                                                  import('@sinclair/typebox').TString<string>,
                                                  import('@sinclair/typebox').TObject<{}>
                                                ]
                                              >
                                            >
                                      }>,
                                      import('@sinclair/typebox').TObject<
                                        | {
                                            [key: string]: import('@sinclair/typebox').TSchema
                                          }
                                        | undefined
                                      >
                                    ]
                                  >
                                >
                              ]
                            >
                          >
                          product_id: import('@sinclair/typebox').TOptional<
                            import('@sinclair/typebox').TUnion<
                              [
                                import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >,
                                import('@sinclair/typebox').TPartial<
                                  import('@sinclair/typebox').TIntersect<
                                    [
                                      import('@sinclair/typebox').TObject<{
                                        $gt: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $gte: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $lt: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $lte: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $ne: import('@sinclair/typebox').TUnion<
                                          [
                                            import('@sinclair/typebox').TString<string>,
                                            import('@sinclair/typebox').TObject<{}>
                                          ]
                                        >
                                        $in:
                                          | import('@sinclair/typebox').TUnion<
                                              [
                                                import('@sinclair/typebox').TString<string>,
                                                import('@sinclair/typebox').TObject<{}>
                                              ]
                                            >
                                          | import('@sinclair/typebox').TArray<
                                              import('@sinclair/typebox').TUnion<
                                                [
                                                  import('@sinclair/typebox').TString<string>,
                                                  import('@sinclair/typebox').TObject<{}>
                                                ]
                                              >
                                            >
                                        $nin:
                                          | import('@sinclair/typebox').TUnion<
                                              [
                                                import('@sinclair/typebox').TString<string>,
                                                import('@sinclair/typebox').TObject<{}>
                                              ]
                                            >
                                          | import('@sinclair/typebox').TArray<
                                              import('@sinclair/typebox').TUnion<
                                                [
                                                  import('@sinclair/typebox').TString<string>,
                                                  import('@sinclair/typebox').TObject<{}>
                                                ]
                                              >
                                            >
                                      }>,
                                      import('@sinclair/typebox').TObject<
                                        | {
                                            [key: string]: import('@sinclair/typebox').TSchema
                                          }
                                        | undefined
                                      >
                                    ]
                                  >
                                >
                              ]
                            >
                          >
                          market_price: import('@sinclair/typebox').TOptional<
                            import('@sinclair/typebox').TUnion<
                              [
                                import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>,
                                import('@sinclair/typebox').TPartial<
                                  import('@sinclair/typebox').TIntersect<
                                    [
                                      import('@sinclair/typebox').TObject<{
                                        $gt: import('@sinclair/typebox').TOptional<
                                          import('@sinclair/typebox').TNumber
                                        >
                                        $gte: import('@sinclair/typebox').TOptional<
                                          import('@sinclair/typebox').TNumber
                                        >
                                        $lt: import('@sinclair/typebox').TOptional<
                                          import('@sinclair/typebox').TNumber
                                        >
                                        $lte: import('@sinclair/typebox').TOptional<
                                          import('@sinclair/typebox').TNumber
                                        >
                                        $ne: import('@sinclair/typebox').TOptional<
                                          import('@sinclair/typebox').TNumber
                                        >
                                        $in:
                                          | import('@sinclair/typebox').TOptional<
                                              import('@sinclair/typebox').TNumber
                                            >
                                          | import('@sinclair/typebox').TArray<
                                              import('@sinclair/typebox').TOptional<
                                                import('@sinclair/typebox').TNumber
                                              >
                                            >
                                        $nin:
                                          | import('@sinclair/typebox').TOptional<
                                              import('@sinclair/typebox').TNumber
                                            >
                                          | import('@sinclair/typebox').TArray<
                                              import('@sinclair/typebox').TOptional<
                                                import('@sinclair/typebox').TNumber
                                              >
                                            >
                                      }>,
                                      import('@sinclair/typebox').TObject<
                                        | {
                                            [key: string]: import('@sinclair/typebox').TSchema
                                          }
                                        | undefined
                                      >
                                    ]
                                  >
                                >
                              ]
                            >
                          >
                        }>
                      >
                    >
                  }>
                ]
              >
            >
            $or: import('@sinclair/typebox').TArray<
              import('@sinclair/typebox').TOptional<
                import('@sinclair/typebox').TObject<{
                  timestamp: import('@sinclair/typebox').TOptional<
                    import('@sinclair/typebox').TUnion<
                      [
                        import('@sinclair/typebox').TNumber,
                        import('@sinclair/typebox').TPartial<
                          import('@sinclair/typebox').TIntersect<
                            [
                              import('@sinclair/typebox').TObject<{
                                $gt: import('@sinclair/typebox').TNumber
                                $gte: import('@sinclair/typebox').TNumber
                                $lt: import('@sinclair/typebox').TNumber
                                $lte: import('@sinclair/typebox').TNumber
                                $ne: import('@sinclair/typebox').TNumber
                                $in:
                                  | import('@sinclair/typebox').TNumber
                                  | import('@sinclair/typebox').TArray<import('@sinclair/typebox').TNumber>
                                $nin:
                                  | import('@sinclair/typebox').TNumber
                                  | import('@sinclair/typebox').TArray<import('@sinclair/typebox').TNumber>
                              }>,
                              import('@sinclair/typebox').TObject<
                                | {
                                    [key: string]: import('@sinclair/typebox').TSchema
                                  }
                                | undefined
                              >
                            ]
                          >
                        >
                      ]
                    >
                  >
                  _id: import('@sinclair/typebox').TOptional<
                    import('@sinclair/typebox').TUnion<
                      [
                        import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TString<string>,
                            import('@sinclair/typebox').TObject<{}>
                          ]
                        >,
                        import('@sinclair/typebox').TPartial<
                          import('@sinclair/typebox').TIntersect<
                            [
                              import('@sinclair/typebox').TObject<{
                                $gt: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $gte: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $lt: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $lte: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $ne: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $in:
                                  | import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                  | import('@sinclair/typebox').TArray<
                                      import('@sinclair/typebox').TUnion<
                                        [
                                          import('@sinclair/typebox').TString<string>,
                                          import('@sinclair/typebox').TObject<{}>
                                        ]
                                      >
                                    >
                                $nin:
                                  | import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                  | import('@sinclair/typebox').TArray<
                                      import('@sinclair/typebox').TUnion<
                                        [
                                          import('@sinclair/typebox').TString<string>,
                                          import('@sinclair/typebox').TObject<{}>
                                        ]
                                      >
                                    >
                              }>,
                              import('@sinclair/typebox').TObject<
                                | {
                                    [key: string]: import('@sinclair/typebox').TSchema
                                  }
                                | undefined
                              >
                            ]
                          >
                        >
                      ]
                    >
                  >
                  product_id: import('@sinclair/typebox').TOptional<
                    import('@sinclair/typebox').TUnion<
                      [
                        import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TString<string>,
                            import('@sinclair/typebox').TObject<{}>
                          ]
                        >,
                        import('@sinclair/typebox').TPartial<
                          import('@sinclair/typebox').TIntersect<
                            [
                              import('@sinclair/typebox').TObject<{
                                $gt: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $gte: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $lt: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $lte: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $ne: import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                                $in:
                                  | import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                  | import('@sinclair/typebox').TArray<
                                      import('@sinclair/typebox').TUnion<
                                        [
                                          import('@sinclair/typebox').TString<string>,
                                          import('@sinclair/typebox').TObject<{}>
                                        ]
                                      >
                                    >
                                $nin:
                                  | import('@sinclair/typebox').TUnion<
                                      [
                                        import('@sinclair/typebox').TString<string>,
                                        import('@sinclair/typebox').TObject<{}>
                                      ]
                                    >
                                  | import('@sinclair/typebox').TArray<
                                      import('@sinclair/typebox').TUnion<
                                        [
                                          import('@sinclair/typebox').TString<string>,
                                          import('@sinclair/typebox').TObject<{}>
                                        ]
                                      >
                                    >
                              }>,
                              import('@sinclair/typebox').TObject<
                                | {
                                    [key: string]: import('@sinclair/typebox').TSchema
                                  }
                                | undefined
                              >
                            ]
                          >
                        >
                      ]
                    >
                  >
                  market_price: import('@sinclair/typebox').TOptional<
                    import('@sinclair/typebox').TUnion<
                      [
                        import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>,
                        import('@sinclair/typebox').TPartial<
                          import('@sinclair/typebox').TIntersect<
                            [
                              import('@sinclair/typebox').TObject<{
                                $gt: import('@sinclair/typebox').TOptional<
                                  import('@sinclair/typebox').TNumber
                                >
                                $gte: import('@sinclair/typebox').TOptional<
                                  import('@sinclair/typebox').TNumber
                                >
                                $lt: import('@sinclair/typebox').TOptional<
                                  import('@sinclair/typebox').TNumber
                                >
                                $lte: import('@sinclair/typebox').TOptional<
                                  import('@sinclair/typebox').TNumber
                                >
                                $ne: import('@sinclair/typebox').TOptional<
                                  import('@sinclair/typebox').TNumber
                                >
                                $in:
                                  | import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
                                  | import('@sinclair/typebox').TArray<
                                      import('@sinclair/typebox').TOptional<
                                        import('@sinclair/typebox').TNumber
                                      >
                                    >
                                $nin:
                                  | import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
                                  | import('@sinclair/typebox').TArray<
                                      import('@sinclair/typebox').TOptional<
                                        import('@sinclair/typebox').TNumber
                                      >
                                    >
                              }>,
                              import('@sinclair/typebox').TObject<
                                | {
                                    [key: string]: import('@sinclair/typebox').TSchema
                                  }
                                | undefined
                              >
                            ]
                          >
                        >
                      ]
                    >
                  >
                }>
              >
            >
          }>
        >,
        import('@sinclair/typebox').TOptional<
          import('@sinclair/typebox').TObject<{
            timestamp: import('@sinclair/typebox').TOptional<
              import('@sinclair/typebox').TUnion<
                [
                  import('@sinclair/typebox').TNumber,
                  import('@sinclair/typebox').TPartial<
                    import('@sinclair/typebox').TIntersect<
                      [
                        import('@sinclair/typebox').TObject<{
                          $gt: import('@sinclair/typebox').TNumber
                          $gte: import('@sinclair/typebox').TNumber
                          $lt: import('@sinclair/typebox').TNumber
                          $lte: import('@sinclair/typebox').TNumber
                          $ne: import('@sinclair/typebox').TNumber
                          $in:
                            | import('@sinclair/typebox').TNumber
                            | import('@sinclair/typebox').TArray<import('@sinclair/typebox').TNumber>
                          $nin:
                            | import('@sinclair/typebox').TNumber
                            | import('@sinclair/typebox').TArray<import('@sinclair/typebox').TNumber>
                        }>,
                        import('@sinclair/typebox').TObject<
                          | {
                              [key: string]: import('@sinclair/typebox').TSchema
                            }
                          | undefined
                        >
                      ]
                    >
                  >
                ]
              >
            >
            _id: import('@sinclair/typebox').TOptional<
              import('@sinclair/typebox').TUnion<
                [
                  import('@sinclair/typebox').TUnion<
                    [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
                  >,
                  import('@sinclair/typebox').TPartial<
                    import('@sinclair/typebox').TIntersect<
                      [
                        import('@sinclair/typebox').TObject<{
                          $gt: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $gte: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $lt: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $lte: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $ne: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $in:
                            | import('@sinclair/typebox').TUnion<
                                [
                                  import('@sinclair/typebox').TString<string>,
                                  import('@sinclair/typebox').TObject<{}>
                                ]
                              >
                            | import('@sinclair/typebox').TArray<
                                import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                              >
                          $nin:
                            | import('@sinclair/typebox').TUnion<
                                [
                                  import('@sinclair/typebox').TString<string>,
                                  import('@sinclair/typebox').TObject<{}>
                                ]
                              >
                            | import('@sinclair/typebox').TArray<
                                import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                              >
                        }>,
                        import('@sinclair/typebox').TObject<
                          | {
                              [key: string]: import('@sinclair/typebox').TSchema
                            }
                          | undefined
                        >
                      ]
                    >
                  >
                ]
              >
            >
            product_id: import('@sinclair/typebox').TOptional<
              import('@sinclair/typebox').TUnion<
                [
                  import('@sinclair/typebox').TUnion<
                    [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
                  >,
                  import('@sinclair/typebox').TPartial<
                    import('@sinclair/typebox').TIntersect<
                      [
                        import('@sinclair/typebox').TObject<{
                          $gt: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $gte: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $lt: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $lte: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $ne: import('@sinclair/typebox').TUnion<
                            [
                              import('@sinclair/typebox').TString<string>,
                              import('@sinclair/typebox').TObject<{}>
                            ]
                          >
                          $in:
                            | import('@sinclair/typebox').TUnion<
                                [
                                  import('@sinclair/typebox').TString<string>,
                                  import('@sinclair/typebox').TObject<{}>
                                ]
                              >
                            | import('@sinclair/typebox').TArray<
                                import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                              >
                          $nin:
                            | import('@sinclair/typebox').TUnion<
                                [
                                  import('@sinclair/typebox').TString<string>,
                                  import('@sinclair/typebox').TObject<{}>
                                ]
                              >
                            | import('@sinclair/typebox').TArray<
                                import('@sinclair/typebox').TUnion<
                                  [
                                    import('@sinclair/typebox').TString<string>,
                                    import('@sinclair/typebox').TObject<{}>
                                  ]
                                >
                              >
                        }>,
                        import('@sinclair/typebox').TObject<
                          | {
                              [key: string]: import('@sinclair/typebox').TSchema
                            }
                          | undefined
                        >
                      ]
                    >
                  >
                ]
              >
            >
            market_price: import('@sinclair/typebox').TOptional<
              import('@sinclair/typebox').TUnion<
                [
                  import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>,
                  import('@sinclair/typebox').TPartial<
                    import('@sinclair/typebox').TIntersect<
                      [
                        import('@sinclair/typebox').TObject<{
                          $gt: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
                          $gte: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
                          $lt: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
                          $lte: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
                          $ne: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
                          $in:
                            | import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
                            | import('@sinclair/typebox').TArray<
                                import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
                              >
                          $nin:
                            | import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
                            | import('@sinclair/typebox').TArray<
                                import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TNumber>
                              >
                        }>,
                        import('@sinclair/typebox').TObject<
                          | {
                              [key: string]: import('@sinclair/typebox').TSchema
                            }
                          | undefined
                        >
                      ]
                    >
                  >
                ]
              >
            >
          }>
        >
      ]
    >,
    import('@sinclair/typebox').TObject<{}>
  ]
>
export type PricesQuery = Static<typeof pricesQuerySchema>
export declare const pricesQueryValidator: import('@feathersjs/schema').Validator<any, any>
export declare const pricesQueryResolver: import('@feathersjs/schema').Resolver<
  Partial<{
    $limit: number
    $skip: number
    $sort: {
      timestamp?: number | undefined
      _id?: number | undefined
      product_id?: number | undefined
      market_price?: number | undefined
    }
    $select: ('timestamp' | '_id' | 'product_id' | 'market_price')[]
    $and: (
      | {
          timestamp?:
            | number
            | Partial<
                {
                  $gt: number
                  $gte: number
                  $lt: number
                  $lte: number
                  $ne: number
                  $in: number | number[]
                  $nin: number | number[]
                } & {}
              >
            | undefined
          _id?:
            | string
            | {}
            | Partial<
                {
                  $gt: string | {}
                  $gte: string | {}
                  $lt: string | {}
                  $lte: string | {}
                  $ne: string | {}
                  $in: string | {} | (string | {})[]
                  $nin: string | {} | (string | {})[]
                } & {}
              >
            | undefined
          product_id?:
            | string
            | {}
            | Partial<
                {
                  $gt: string | {}
                  $gte: string | {}
                  $lt: string | {}
                  $lte: string | {}
                  $ne: string | {}
                  $in: string | {} | (string | {})[]
                  $nin: string | {} | (string | {})[]
                } & {}
              >
            | undefined
          market_price?:
            | number
            | Partial<
                {
                  $gt?: number | undefined
                  $gte?: number | undefined
                  $lt?: number | undefined
                  $lte?: number | undefined
                  $ne?: number | undefined
                  $in: number | number[]
                  $nin: number | number[]
                } & {}
              >
            | undefined
        }
      | {
          $or: {
            timestamp?:
              | number
              | Partial<
                  {
                    $gt: number
                    $gte: number
                    $lt: number
                    $lte: number
                    $ne: number
                    $in: number | number[]
                    $nin: number | number[]
                  } & {}
                >
              | undefined
            _id?:
              | string
              | {}
              | Partial<
                  {
                    $gt: string | {}
                    $gte: string | {}
                    $lt: string | {}
                    $lte: string | {}
                    $ne: string | {}
                    $in: string | {} | (string | {})[]
                    $nin: string | {} | (string | {})[]
                  } & {}
                >
              | undefined
            product_id?:
              | string
              | {}
              | Partial<
                  {
                    $gt: string | {}
                    $gte: string | {}
                    $lt: string | {}
                    $lte: string | {}
                    $ne: string | {}
                    $in: string | {} | (string | {})[]
                    $nin: string | {} | (string | {})[]
                  } & {}
                >
              | undefined
            market_price?:
              | number
              | Partial<
                  {
                    $gt?: number | undefined
                    $gte?: number | undefined
                    $lt?: number | undefined
                    $lte?: number | undefined
                    $ne?: number | undefined
                    $in: number | number[]
                    $nin: number | number[]
                  } & {}
                >
              | undefined
          }[]
        }
    )[]
    $or: {
      timestamp?:
        | number
        | Partial<
            {
              $gt: number
              $gte: number
              $lt: number
              $lte: number
              $ne: number
              $in: number | number[]
              $nin: number | number[]
            } & {}
          >
        | undefined
      _id?:
        | string
        | {}
        | Partial<
            {
              $gt: string | {}
              $gte: string | {}
              $lt: string | {}
              $lte: string | {}
              $ne: string | {}
              $in: string | {} | (string | {})[]
              $nin: string | {} | (string | {})[]
            } & {}
          >
        | undefined
      product_id?:
        | string
        | {}
        | Partial<
            {
              $gt: string | {}
              $gte: string | {}
              $lt: string | {}
              $lte: string | {}
              $ne: string | {}
              $in: string | {} | (string | {})[]
              $nin: string | {} | (string | {})[]
            } & {}
          >
        | undefined
      market_price?:
        | number
        | Partial<
            {
              $gt?: number | undefined
              $gte?: number | undefined
              $lt?: number | undefined
              $lte?: number | undefined
              $ne?: number | undefined
              $in: number | number[]
              $nin: number | number[]
            } & {}
          >
        | undefined
    }[]
  }> & {
    timestamp?:
      | number
      | Partial<
          {
            $gt: number
            $gte: number
            $lt: number
            $lte: number
            $ne: number
            $in: number | number[]
            $nin: number | number[]
          } & {}
        >
      | undefined
    _id?:
      | string
      | {}
      | Partial<
          {
            $gt: string | {}
            $gte: string | {}
            $lt: string | {}
            $lte: string | {}
            $ne: string | {}
            $in: string | {} | (string | {})[]
            $nin: string | {} | (string | {})[]
          } & {}
        >
      | undefined
    product_id?:
      | string
      | {}
      | Partial<
          {
            $gt: string | {}
            $gte: string | {}
            $lt: string | {}
            $lte: string | {}
            $ne: string | {}
            $in: string | {} | (string | {})[]
            $nin: string | {} | (string | {})[]
          } & {}
        >
      | undefined
    market_price?:
      | number
      | Partial<
          {
            $gt?: number | undefined
            $gte?: number | undefined
            $lt?: number | undefined
            $lte?: number | undefined
            $ne?: number | undefined
            $in: number | number[]
            $nin: number | number[]
          } & {}
        >
      | undefined
  } & {},
  HookContext<PricesService<import('./prices.class').PricesParams>>
>
