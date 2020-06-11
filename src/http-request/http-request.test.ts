import { HttpRequest } from './http-request'
import { Method } from './http-request.model'

describe('makes an initial request to couch server', () => {
  it('should be welcomed by locally running couch server', async () => {
    const path: string = '/'
    const method: string = Method.GET
    const httpRequest = new HttpRequest(path, method)
    const body: any = await httpRequest.getRequest()
    expect(body.couchdb).toBe('Welcome')
  })
})
