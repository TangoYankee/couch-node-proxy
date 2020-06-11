import { HttpRequest } from './http-request/http-request'

export const getGreeting = (): string => {
  return 'Hello, Test!'
}

export const requestHandler = async (req: Request, res: Response) => {
  const url: string = req.url
  if (url === '/') {
    const httpRequest = new HttpRequest(url, req.method)
    const body: any = await httpRequest.getRequest()
    return body.couchdb
  } else {
    return 'go away'
  }
}
