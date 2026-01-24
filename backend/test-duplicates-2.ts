import { app } from './src/app';  // Import your Feathers app

async function testDuplicates() {
  try {
    console.log('Starting duplicate test...');
    const totalProducts = await app.service('products').find({ query: {}, paginate: false });
    console.log('Total products in DB:', totalProducts.length);

    const duplicateGroups = await app.service('products').find({
      pipeline: [
        {
          $group: {
            _id: { name: '$name' },
            products: {
              $push: {
                _id: '$_id',
                name: '$name',
                tcgcsv_id: '$external_id.tcgcsv_id',
                set_id: '$set_id',
                type: '$type'
              }
            },
            uniqueTcgcsvIds: { $addToSet: '$external_id.tcgcsv_id' },
            count: { $sum: 1 }
          }
        },
        {
          $match: { 'uniqueTcgcsvIds.1': { $exists: true } }
        }
      ],
      paginate: false
    });

    console.log('Duplicate Groups Found:', duplicateGroups.length);
    if (duplicateGroups.length > 0) {
      console.log('Sample Results:', JSON.stringify(duplicateGroups.slice(0, 3), null, 2));
    } else {
      console.log('No duplicates found—check if names were already disambiguated or if aggregation failed.');
    }
  } catch (error) {
    console.error('Error testing duplicates:', error);
  } finally {
    process.exit(0);
  }
}

// Initialize app and run test
app.setup().then(testDuplicates);