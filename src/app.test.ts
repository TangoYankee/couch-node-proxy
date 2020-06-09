import { getGreeting, requestHandler } from './app'
import * as httpMocks from 'node-mocks-http'

describe('wire up the modules together', () => {
  it('should be true', () => {
    expect(getGreeting()).toBe('Hello, Test!')
  })
})

describe('route requests', () => {
  var req: Request = httpMocks.createRequest({
    method: 'GET',
    url: '/',
    headers: {
      host: 'localhost:8000'
    }
  })
  var res: Response = httpMocks.createResponse()

  it('should get home string', () => {
    expect(requestHandler(req, res)).toBe('welcome home')
  })
})
