import { handleEvent } from '../src/handler'
import makeServiceWorkerEnv from 'service-worker-mock'

declare var global: any

describe('handle', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv())
    jest.resetModules()
  })

  test('handle GET', async () => {
    const fetchEvent = new FetchEvent('fetch', {
      request: new Request('/', { method: 'GET' }),
    })
    const result = await handleEvent(fetchEvent)
    expect(result.status).toEqual(500)
  })
})
