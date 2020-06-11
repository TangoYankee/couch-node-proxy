import { requestHandler } from './app'
import * as httpMocks from 'node-mocks-http'

const bodyJSON: any = { couchdb: 'Welcome' }
jest.mock('./http-request/http-request', () => {
  return {
    HttpRequest: (url: string, method: string) => {
      return {
        getRequest: jest.fn().mockImplementation(() => {
          return bodyJSON
        })
      }
    }
  }
})

describe('request handler', () => {
  let req: Request
  const res: Response = httpMocks.createResponse()

  it('should hit the home route', async () => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      headers: {
        host: 'localhost:8000'
      }
    })

    const message = await requestHandler(req, res)
    expect(message).toBe('Welcome')
  })

  it('should hit the go away route', async () => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/about',
      headers: {
        host: 'localhost:8000'
      }
    })
    const message = await requestHandler(req, res)
    expect(message).toBe('go away')
  })
})
