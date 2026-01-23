import type { Static } from '@feathersjs/typebox'
import type { HookContext } from '../../declarations'
import type { StoresService } from './stores.class'
export declare const storesSchema: import('@sinclair/typebox').TObject<{
  _id: import('@sinclair/typebox').TUnion<
    [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
  >
  name: import('@sinclair/typebox').TString<string>
  enabled_sets: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
  enabled_games: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
  enabled_oems: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
  enabled_consoles: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
  allow_buying: import('@sinclair/typebox').TBoolean
  allow_selling: import('@sinclair/typebox').TBoolean
  admin_id: import('@sinclair/typebox').TUnion<
    [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
  >
}>
export type Stores = Static<typeof storesSchema>
export declare const storesValidator: import('@feathersjs/schema').Validator<any, any>
export declare const storesResolver: import('@feathersjs/schema').Resolver<
  {
    name: string
    _id: string | {}
    enabled_sets: any[]
    enabled_games: any[]
    enabled_oems: any[]
    enabled_consoles: any[]
    allow_buying: boolean
    allow_selling: boolean
    admin_id: string | {}
  },
  HookContext<StoresService<import('./stores.class').StoresParams>>
>
export declare const storesExternalResolver: import('@feathersjs/schema').Resolver<
  {
    name: string
    _id: string | {}
    enabled_sets: any[]
    enabled_games: any[]
    enabled_oems: any[]
    enabled_consoles: any[]
    allow_buying: boolean
    allow_selling: boolean
    admin_id: string | {}
  },
  HookContext<StoresService<import('./stores.class').StoresParams>>
>
export declare const storesDataSchema: import('@sinclair/typebox').TPick<
  import('@sinclair/typebox').TObject<{
    _id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    name: import('@sinclair/typebox').TString<string>
    enabled_sets: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
    enabled_games: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
    enabled_oems: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
    enabled_consoles: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
    allow_buying: import('@sinclair/typebox').TBoolean
    allow_selling: import('@sinclair/typebox').TBoolean
    admin_id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
  }>,
  ['name', 'admin_id']
>
export type StoresData = Static<typeof storesDataSchema>
export declare const storesDataValidator: import('@feathersjs/schema').Validator<any, any>
export declare const storesDataResolver: import('@feathersjs/schema').Resolver<
  {
    name: string
    _id: string | {}
    enabled_sets: any[]
    enabled_games: any[]
    enabled_oems: any[]
    enabled_consoles: any[]
    allow_buying: boolean
    allow_selling: boolean
    admin_id: string | {}
  },
  HookContext<StoresService<import('./stores.class').StoresParams>>
>
export declare const storesPatchSchema: import('@sinclair/typebox').TPartial<
  import('@sinclair/typebox').TObject<{
    _id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    name: import('@sinclair/typebox').TString<string>
    enabled_sets: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
    enabled_games: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
    enabled_oems: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
    enabled_consoles: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
    allow_buying: import('@sinclair/typebox').TBoolean
    allow_selling: import('@sinclair/typebox').TBoolean
    admin_id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
  }>
>
export type StoresPatch = Static<typeof storesPatchSchema>
export declare const storesPatchValidator: import('@feathersjs/schema').Validator<any, any>
export declare const storesPatchResolver: import('@feathersjs/schema').Resolver<
  {
    name: string
    _id: string | {}
    enabled_sets: any[]
    enabled_games: any[]
    enabled_oems: any[]
    enabled_consoles: any[]
    allow_buying: boolean
    allow_selling: boolean
    admin_id: string | {}
  },
  HookContext<StoresService<import('./stores.class').StoresParams>>
>
export declare const storesQueryProperties: import('@sinclair/typebox').TPick<
  import('@sinclair/typebox').TObject<{
    _id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
    name: import('@sinclair/typebox').TString<string>
    enabled_sets: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
    enabled_games: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
    enabled_oems: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
    enabled_consoles: import('@sinclair/typebox').TArray<import('@sinclair/typebox').TAny>
    allow_buying: import('@sinclair/typebox').TBoolean
    allow_selling: import('@sinclair/typebox').TBoolean
    admin_id: import('@sinclair/typebox').TUnion<
      [import('@sinclair/typebox').TString<string>, import('@sinclair/typebox').TObject<{}>]
    >
  }>,
  ['_id', 'name']
>
export declare const storesQuerySchema: import('@sinclair/typebox').TIntersect<
  [
    import('@sinclair/typebox').TIntersect<
      [
        import('@sinclair/typebox').TPartial<
          import('@sinclair/typebox').TObject<{
            $limit: import('@sinclair/typebox').TNumber
            $skip: import('@sinclair/typebox').TNumber
            $sort: import('@sinclair/typebox').TObject<{
              name: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TInteger>
              _id: import('@sinclair/typebox').TOptional<import('@sinclair/typebox').TInteger>
            }>
            $select: import('@sinclair/typebox').TUnsafe<('name' | '_id')[]>
            $and: import('@sinclair/typebox').TArray<
              import('@sinclair/typebox').TUnion<
                [
                  import('@sinclair/typebox').TOptional<
                    import('@sinclair/typebox').TObject<{
                      name: import('@sinclair/typebox').TOptional<
                        import('@sinclair/typebox').TUnion<
                          [
                            import('@sinclair/typebox').TString<string>,
                            import('@sinclair/typebox').TPartial<
                              import('@sinclair/typebox').TIntersect<
                                [
                                  import('@sinclair/typebox').TObject<{
                                    $gt: import('@sinclair/typebox').TString<string>
                                    $gte: import('@sinclair/typebox').TString<string>
                                    $lt: import('@sinclair/typebox').TString<string>
                                    $lte: import('@sinclair/typebox').TString<string>
                                    $ne: import('@sinclair/typebox').TString<string>
                                    $in:
                                      | import('@sinclair/typebox').TString<string>
                                      | import('@sinclair/typebox').TArray<
                                          import('@sinclair/typebox').TString<string>
                                        >
                                    $nin:
                                      | import('@sinclair/typebox').TString<string>
                                      | import('@sinclair/typebox').TArray<
                                          import('@sinclair/typebox').TString<string>
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
                    }>
                  >,
                  import('@sinclair/typebox').TObject<{
                    $or: import('@sinclair/typebox').TArray<
                      import('@sinclair/typebox').TOptional<
                        import('@sinclair/typebox').TObject<{
                          name: import('@sinclair/typebox').TOptional<
                            import('@sinclair/typebox').TUnion<
                              [
                                import('@sinclair/typebox').TString<string>,
                                import('@sinclair/typebox').TPartial<
                                  import('@sinclair/typebox').TIntersect<
                                    [
                                      import('@sinclair/typebox').TObject<{
                                        $gt: import('@sinclair/typebox').TString<string>
                                        $gte: import('@sinclair/typebox').TString<string>
                                        $lt: import('@sinclair/typebox').TString<string>
                                        $lte: import('@sinclair/typebox').TString<string>
                                        $ne: import('@sinclair/typebox').TString<string>
                                        $in:
                                          | import('@sinclair/typebox').TString<string>
                                          | import('@sinclair/typebox').TArray<
                                              import('@sinclair/typebox').TString<string>
                                            >
                                        $nin:
                                          | import('@sinclair/typebox').TString<string>
                                          | import('@sinclair/typebox').TArray<
                                              import('@sinclair/typebox').TString<string>
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
                  name: import('@sinclair/typebox').TOptional<
                    import('@sinclair/typebox').TUnion<
                      [
                        import('@sinclair/typebox').TString<string>,
                        import('@sinclair/typebox').TPartial<
                          import('@sinclair/typebox').TIntersect<
                            [
                              import('@sinclair/typebox').TObject<{
                                $gt: import('@sinclair/typebox').TString<string>
                                $gte: import('@sinclair/typebox').TString<string>
                                $lt: import('@sinclair/typebox').TString<string>
                                $lte: import('@sinclair/typebox').TString<string>
                                $ne: import('@sinclair/typebox').TString<string>
                                $in:
                                  | import('@sinclair/typebox').TString<string>
                                  | import('@sinclair/typebox').TArray<
                                      import('@sinclair/typebox').TString<string>
                                    >
                                $nin:
                                  | import('@sinclair/typebox').TString<string>
                                  | import('@sinclair/typebox').TArray<
                                      import('@sinclair/typebox').TString<string>
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
                }>
              >
            >
          }>
        >,
        import('@sinclair/typebox').TOptional<
          import('@sinclair/typebox').TObject<{
            name: import('@sinclair/typebox').TOptional<
              import('@sinclair/typebox').TUnion<
                [
                  import('@sinclair/typebox').TString<string>,
                  import('@sinclair/typebox').TPartial<
                    import('@sinclair/typebox').TIntersect<
                      [
                        import('@sinclair/typebox').TObject<{
                          $gt: import('@sinclair/typebox').TString<string>
                          $gte: import('@sinclair/typebox').TString<string>
                          $lt: import('@sinclair/typebox').TString<string>
                          $lte: import('@sinclair/typebox').TString<string>
                          $ne: import('@sinclair/typebox').TString<string>
                          $in:
                            | import('@sinclair/typebox').TString<string>
                            | import('@sinclair/typebox').TArray<import('@sinclair/typebox').TString<string>>
                          $nin:
                            | import('@sinclair/typebox').TString<string>
                            | import('@sinclair/typebox').TArray<import('@sinclair/typebox').TString<string>>
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
          }>
        >
      ]
    >,
    import('@sinclair/typebox').TObject<{}>
  ]
>
export type StoresQuery = Static<typeof storesQuerySchema>
export declare const storesQueryValidator: import('@feathersjs/schema').Validator<any, any>
export declare const storesQueryResolver: import('@feathersjs/schema').Resolver<
  Partial<{
    $limit: number
    $skip: number
    $sort: {
      name?: number | undefined
      _id?: number | undefined
    }
    $select: ('name' | '_id')[]
    $and: (
      | {
          name?:
            | string
            | Partial<
                {
                  $gt: string
                  $gte: string
                  $lt: string
                  $lte: string
                  $ne: string
                  $in: string | string[]
                  $nin: string | string[]
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
        }
      | {
          $or: {
            name?:
              | string
              | Partial<
                  {
                    $gt: string
                    $gte: string
                    $lt: string
                    $lte: string
                    $ne: string
                    $in: string | string[]
                    $nin: string | string[]
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
          }[]
        }
    )[]
    $or: {
      name?:
        | string
        | Partial<
            {
              $gt: string
              $gte: string
              $lt: string
              $lte: string
              $ne: string
              $in: string | string[]
              $nin: string | string[]
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
    }[]
  }> & {
    name?:
      | string
      | Partial<
          {
            $gt: string
            $gte: string
            $lt: string
            $lte: string
            $ne: string
            $in: string | string[]
            $nin: string | string[]
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
  } & {},
  HookContext<StoresService<import('./stores.class').StoresParams>>
>
