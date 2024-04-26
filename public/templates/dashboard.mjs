import { header } from "./header.mjs"
import { setListTemplate } from "./set-list.mjs"



export const dashboardTemplate = (error) =>
  `
<section id="control" class='py-8 mx-auto'>
  <div class="mx-auto w-5/6">
    <button class="inline show-games-list btn sm:btn-sm md:btn-md lg:btn-lg">Manage Games</button>
    <button class="inline update-data btn  sm:btn-sm md:btn-md lg:btn-lg">Update All Data</button>
    <button class="inline update-sets btn sm:btn-sm md:btn-md lg:btn-lg">Update Sets Only</button>
    <label class="form-control w-full max-w-xs">
  <div class="label">
    <span class="label-text">Import Lightspeed CSV</span>
  </div>
  <input type="file" id="import-csv" class="file-input file-input-md file-input-bordered w-full max-w-xs" />
</label>
  </div>

</section>
   ` + setListTemplate 