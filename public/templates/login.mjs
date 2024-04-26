import { header } from "./header.mjs"


// Login screen
export const loginTemplate = (error) =>
  `
<div class="login flex min-h-screen bg-neutral justify-center items-center">
<div class="card w-full max-w-sm bg-base-100 px-4 py-8 shadow-xl">
  <div class="px-4"><i alt="" class="h-32 w-32 block mx-auto i-logos-feathersjs invert"></i>
    <h1 class="text-5xl font-bold text-center my-5 bg-clip-text bg-gradient-to-br">
      TCG Pricing Tool
    </h1>
  </div>
  <form class="card-body pt-2">
    ${
      error
        ? `<div class="alert alert-error justify-start">
      <i class="i-feather-alert-triangle"></i>
      <span class="flex-grow">${error.message}</span>
    </div>`
        : ''
    }
    <div class="form-control">
      <label for="email" class="label"><span class="label-text">Email</span></label>
      <input type="text" name="email" placeholder="enter email" class="input input-bordered">
    </div>
    <div class="form-control mt-0">
      <label for="password" class="label"><span class="label-text">Password</span></label>
      <input type="password" name="password" placeholder="enter password" class="input input-bordered">
    </div>
    <div class="form-control mt-6"><button id="login" type="button" class="btn">Login</button></div>
    <div class="form-control mt-6"><button id="signup" type="button" class="btn">Signup</button></div>
  </form>
</div>
</div>`