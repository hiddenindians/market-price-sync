// src/hooks/filter-store-status.ts
import type { HookContext } from '../declarations'
import type { ObjectId } from 'mongodb'

// Define the type for the store_status entry
interface StoreStatus {
  store_id: ObjectId;
  visible: boolean;
}

export const filterStoreStatus = async (context: HookContext) => {
  const { result, params } = context;
  const storeId = params.user?.store_id;
  console.log(storeId)
  console.log(result)

  if (result.data && storeId) {
    if (Array.isArray(result.data)) {
      console.log("isArray")
      // If the result is an array of games
      context.result.data = result.data.map((game: any) => ({
        ...game,
        store_status: Array.isArray(game.store_status)
          ? game.store_status.filter((status: StoreStatus) => status.store_id.toString() === storeId.toString())
          : []
      }));
    } else {
      // If the result is a single game
      context.result.data[0].store_status = Array.isArray(result.store_status)
        ? result.store_status.filter((status: StoreStatus) => status.store_id.toString() === storeId.toString())
        : [];
    }
  }

  return context;
}