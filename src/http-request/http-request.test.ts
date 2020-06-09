import { RequestOptions } from 'http'
import { httpRequest } from './http-request'
import { HttpMethod } from './http-request.model'

describe('makes an initial request to couch server', () => {
  const options = <RequestOptions>{
    hostname: 'localhost',
    port: 5984,
    path: '/',
    method: HttpMethod.GET
  }

  it('should be welcomed by locally running couch server', async () => {
    const body: any = await httpRequest(options)
    expect(body.couchdb).toBe('Welcome')
  })
})
