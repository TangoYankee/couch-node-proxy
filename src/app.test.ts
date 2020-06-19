import { requestHandler } from './app'
import * as httpMocks from 'node-mocks-http'
import * as http from 'http'

let body: string
jest.mock('./http-request/http-request', () => {
  return {
    HttpRequest: (url: string, method: string) => {
      return {
        getRequest: jest.fn().mockImplementation(() => {
          return body
        })
      }
    }
  }
})

describe('request handler', () => {
  let req: http.IncomingMessage
  let res: any

  beforeEach(() => {
    res = httpMocks.createResponse()
  })

  afterEach(() => {
    res = undefined
  })

  it('should hit the home route', async () => {
    body = '{ "couchdb": "Welcome", "version": "3.1.0"}'
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      headers: {
        host: 'localhost:8000'
      }
    })

    await requestHandler(req, res)
    const data = res._getJSONData()
    expect(res.statusCode).toBe(200)
    expect(data.couchdb).toBe('Welcome')
  })

  it('should hit the go away route', async () => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/about',
      headers: {
        host: 'localhost:8000'
      }
    })
    await requestHandler(req, res)
    const data = res._getJSONData()
    expect(res.statusCode).toBe(401)
    expect(data.message).toBe('go away')
  })
})
