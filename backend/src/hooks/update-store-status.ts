import { HookContext } from '@feathersjs/feathers';
import { Application } from '../declarations';

const BATCH_SIZE = 100; // Adjust the batch size as needed

export const updateStoreStatus = async (context: HookContext) => {
  const { app, result } = context;
  const storeId = result._id;

  // Fetch all products
  const products = await app.service('products').find({
    paginate: false
  });

  // Process products in batches
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);

    const updatePromises = batch.map((product: any) => {
      const storeStatus = {
        store_id: storeId,
        enabled: false,
        buying: { enabled: false, quantity: 0 },
        selling: { enabled: false, quantity: 0 }
      };

      return app.service('products').patch(product._id, {
        $push: { store_status: storeStatus }
      });
    });

    await Promise.all(updatePromises);
  }

  return context;
};