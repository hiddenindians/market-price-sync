# Option 2 Implementation Plan

## Objective
Persist structured print information per product at ingestion time, expose per-game filter lists, and allow server-side product filtering by rarity and print. Ensure the backend schema supports the new `print` field and the frontend consumes the new filters.

---

## Progress
- ✅ 1. Schema & Model Updates
- ✅ 2. Ingestion Hook Changes
- ✅ 3. Backfill Existing Products
- ✅ 4. Filter Metadata Endpoint
- ✅ 5. Product Fetch Query Support
- ✅ 6. Frontend Integration
- ✅ 7. Testing
- ⏳ 8. Documentation & Release Notes
- ⏳ 9. Deployment Considerations

1. Schema & Model Updates
   - Add a `print` (string) or `prints` (string array) property to `productsSchema` in `backend/src/services/products/products.schema.ts`.
   - Update TypeScript interfaces (`Products`, `ProductsData`, `ProductsPatch`) so the new field is allowed in create/patch flows.
   - Create or adjust a Mongo index on `{ game_id: 1, rarity: 1, print: 1 }` inside `backend/src/services/products/products.class.ts` to keep filtered queries fast.

2. Ingestion Hook Changes (`backend/src/hooks/update-data.ts`)
   - Before naming logic, normalize `price.subTypeName` via a canonical map (e.g., `Normal -> base`, `Alternate Art -> alternate_art`, etc.).
   - Set `newProduct.print = canonicalKey`; default to `'base'` when the subtype is empty or normal.
   - Keep existing name-building logic for backward compatibility.
   - Ensure product patch paths also set `print` when the product already exists.

3. Backfill Existing Products
   - Add a script `backend/scripts/backfill-product-prints.ts`.
   - Script steps:
     1. Fetch products missing `print`.
     2. Derive a print key (parse name, re-use price history, or fallback to `'base'`).
     3. Patch the product with the derived `print` value.
   - Document and run the script once post-deploy.

4. Filter Metadata Endpoint
   - Create an endpoint `GET /products/filters` that accepts `gameId` (and optionally `setId`).
   - Aggregate distinct `rarity` and `print` values via Mongo aggregation (`$match` on `game_id`, `$group`).
   - Return `{ rarities: string[], prints: [{ key, label }] }`, optionally cached per game.

5. Product Fetch Query Support
   - Extend existing Feathers product fetch services to accept `rarities[]` and `prints[]` query params.
   - Translate params into Mongo filters (`rarity: { $in: [...] }`, `print: { $in: [...] }`). Include `'base'` handling.
   - Verify pagination totals respect applied filters.

6. Frontend Integration
   - Update data services to call `/products/filters?gameId=...` and fetch options dynamically.
   - Pass selected `rarities` and `prints` when requesting products (game-level and set-level calls).
   - Refresh filter lists on game changes; clear selections as needed.

7. Testing
   - Backend unit tests:
     - Canonicalization helper (subTypeName → print key).
     - Filter endpoint output.
     - Product service queries with `prints`/`rarities` filters.
   - Frontend tests:
     - Component/service tests ensuring filters are fetched and applied when querying products.

8. Documentation & Release Notes
   - Update `AGENTS.md`/README with new `print` field, filter endpoint, and backfill instructions.
   - Note deployment steps for running the backfill script.

9. Deployment Considerations
   - Run the backfill script once the backend is deployed.
   - Monitor ingestion logs to confirm `print` is set for new products.
   - Watch query performance (ensure the new index exists).
   - Coordinate frontend rollout so new filters are available when backend changes go live.
