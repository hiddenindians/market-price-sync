# Duplicate Key Error Fix - Summary

## Problem

Products were slipping through the duplicate check logic and causing MongoDB E11000 duplicate key errors during batch inserts.

### Root Cause

There was a **critical mismatch** between the application's duplicate detection logic and the database's unique constraint:

- **Database unique index:** `{ 'external_id.tcgcsv_id': 1, name: 1 }`
  - Enforced uniqueness based on external ID + display name

- **Application composite key:** `tcgcsv_id + collector_number + rarity + print + finish`
  - Checked for duplicates based on external ID + product attributes

### Why It Failed

1. Two products with the same `tcgcsv_id` but different attributes (e.g., different `print` or `finish`) would pass the application's duplicate check
2. However, if after name construction they ended up with the **same final name**, the database would reject the second insert
3. This caused batch failures with E11000 errors like:
   ```
   E11000 duplicate key error collection: mps.products 
   index: external_id.tcgcsv_id_1_name_1 
   dup key: { external_id.tcgcsv_id: 88668, name: "Regigigas FB - 9 (Holofoil, Holo Rare)" }
   ```

## Solution

### 1. Updated Database Index

**File:** `backend/src/services/products/products.class.ts`

Changed the unique index from:
```typescript
collection.createIndex({ 'external_id.tcgcsv_id': 1, name: 1 }, { unique: true })
```

To:
```typescript
collection.createIndex(
  {
    'external_id.tcgcsv_id': 1,
    collector_number: 1,
    rarity: 1,
    print: 1,
    finish: 1
  },
  { unique: true }
)
```

This aligns the database constraint with the application's `buildProductKey()` logic.

### 2. Graceful Error Handling

**File:** `backend/src/utils/concurrent-pipeline.ts`

Added graceful handling of E11000 duplicate key errors:
- Instead of throwing and failing the entire batch, we now log duplicates and continue processing
- Provides detailed logging of which products were duplicates
- Maintains pipeline throughput while preventing crashes

### 3. Improved Logging

**File:** `backend/src/hooks/update-data.ts`

- Removed noisy debug logging that fired for every product
- Added targeted logging that only fires when duplicates are detected
- Added summary logging for API response deduplication

### 4. Fixed Print Variant Detection

**File:** `backend/src/utils/print-normalizer.ts`

Fixed false positive print variant detection caused by gameplay text containing print keywords:
- **Problem**: Attack names like "Parallel Gain" were being detected as "Parallel" print variants
- **Solution**: Restricted `extractVariantSources` to only check the "Rarity" field in extended data
- **Result**: Gameplay text (attacks, flavor text, HP, etc.) is now ignored during variant detection
- **Example**: "Beautifly" with "Parallel Gain" attack no longer misidentified as "Parallel" print
  - "Holofoil" variant → `print: base`, `finish: foil`
  - "Reverse Holofoil" variant → `print: reverse_holofoil`, `finish: foil`
  - Both now have unique composite keys

## Migration Steps

### ⚠️ IMPORTANT: Manual Database Migration Required

Before deploying this code, you **MUST** run the following steps in MongoDB:

#### Step 1: Drop the old unique index

```javascript
db.products.dropIndex('external_id.tcgcsv_id_1_name_1')
```

#### Step 2: Check for existing duplicates (Optional but Recommended)

Run this aggregation to find any documents that would conflict with the new index:

```javascript
db.products.aggregate([
  { 
    $group: { 
      _id: { 
        tcgcsv_id: '$external_id.tcgcsv_id', 
        collector_number: '$collector_number',
        rarity: '$rarity',
        print: '$print',
        finish: '$finish'
      },
      count: { $sum: 1 },
      docs: { $push: { _id: '$_id', name: '$name', last_updated: '$last_updated' } }
    }
  },
  { $match: { count: { $gt: 1 } } }
])
```

If duplicates are found, you'll need to resolve them before creating the new index.

#### Step 3: Remove duplicates (If any found)

For each duplicate group, keep the document with the most recent `last_updated` and delete the others:

```javascript
// Example: Remove all but the most recent
db.products.deleteOne({ _id: ObjectId('older_duplicate_id') })
```

#### Step 4: Deploy the code

Once the old index is dropped and duplicates are resolved, deploy the updated code. The new index will be created automatically on application startup.

## Expected Behavior After Fix

1. **Duplicate Detection:** Products will be correctly identified as duplicates based on their structural attributes (tcgcsv_id + collector_number + rarity + print + finish)

2. **Graceful Handling:** If any duplicates slip through (race conditions in concurrent processing), they will be caught at the database level and logged without crashing the batch

3. **Cleaner Logs:** Less noise in logs, with targeted information about actual issues

4. **No More Batch Failures:** E11000 errors will no longer cause entire batches to fail

## Files Modified

1. `backend/src/services/products/products.class.ts` - Updated unique index definition
2. `backend/src/utils/concurrent-pipeline.ts` - Added graceful E11000 error handling
3. `backend/src/hooks/update-data.ts` - Cleaned up logging
4. `backend/src/utils/print-normalizer.ts` - Fixed print variant detection to only check Rarity field

## Testing Recommendations

After deploying:

1. Monitor logs for `[pipeline] Insert batch partially completed` messages to see if duplicates are being caught
2. Check for any remaining E11000 errors in logs
3. Verify that products are being inserted/updated correctly
4. Run a full data sync to ensure no products are being skipped

## Rollback Plan

If issues occur:

1. Stop the application
2. Drop the new composite index:
   ```javascript
   db.products.dropIndex('external_id.tcgcsv_id_1_collector_number_1_rarity_1_print_1_finish_1')
   ```
3. Recreate the old index:
   ```javascript
   db.products.createIndex({ 'external_id.tcgcsv_id': 1, name: 1 }, { unique: true })
   ```
4. Revert the code changes and redeploy
