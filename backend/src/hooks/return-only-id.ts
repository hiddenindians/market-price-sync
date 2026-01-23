// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const returnOnlyId = async (context: HookContext) => {
  console.log(`Running hook returnOnlyId on ${context.path}.${context.method}`)
  if (Array.isArray(context.result)) {
    context.result = context.result.map((item) => ({ _id: item._id }))
  } else {
    context.result = { _id: context.result._id }
  }
  return context
}
