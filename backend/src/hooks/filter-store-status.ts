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

  if(!context.params.provider){
    return context;
  }
  if (result && storeId) {
    if (Array.isArray(result.data)) {
      // If the result is an array of products
      context.result.data = result.data.map((product: any) => {
        if (!product.store_status) {
          product.store_status = {};
        }

        if (!product.store_status[storeId]) {
          // Create the store_id object if it doesn't exist
          product.store_status[storeId] = {
            selling: { enabled: false, quantity: 0 },
            buying: { enabled: false, quantity: 0 }
          };

          // Update the product in the database
          context.app.service('products').patch(product._id, {
            store_status: product.store_status
          });
        }

        return {
          ...product,
          store_status: { [storeId]: product.store_status[storeId] }
        };
      });
    } else {
      // If the result is a single product
      if (!result.store_status) {
        result.store_status = {};
      }

      if (!result.store_status[storeId]) {
        // Create the store_id object if it doesn't exist
        result.store_status[storeId] = {
          selling: { enabled: false, quantity: 0 },
          buying: { enabled: false, quantity: 0 }
        };

        // Update the product in the database
        await context.app.service('products').patch(result._id, {
          store_status: result.store_status
        });
      }

      context.result.store_status = { [storeId]: result.store_status[storeId] };
    }
  }

  return context;
};