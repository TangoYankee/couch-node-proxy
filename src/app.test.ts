import { getGreeting, requestHandler } from './app'
import * as httpMocks from 'node-mocks-http'
import { HttpRequest } from './http-request/http-request'

let bodyJSON: any
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

describe('create mock http implentation', () => {
  it('should construct HttpRequest', () => {
    const httpRequest = new HttpRequest('/', 'GET')
    expect(httpRequest).toBeTruthy()
  })
})

describe('wire up the modules together', () => {
  it('should be true', () => {
    expect(getGreeting()).toBe('Hello, Test!')
  })
})

describe('route requests', () => {
  let req: Request
  let res: Response
  beforeEach(() => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      headers: {
        host: 'localhost:8000'
      }
    })
    res = httpMocks.createResponse()
    bodyJSON = { couchdb: 'Welcome' }
  })

  it('should hit the couchdb through the route handler', async () => {
    const message = await requestHandler(req, res)
    expect(message).toBe('Welcome')
  })
})
