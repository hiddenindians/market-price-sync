// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'

describe('stores service', () => {
  it('registered the service', () => {
    const service = app.service('stores')

    assert.ok(service, 'Registered the service')
  })
})
