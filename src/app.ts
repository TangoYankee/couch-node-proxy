import * as http from 'http'
import { HttpRequest } from './http-request/http-request'
import { ServerResponse } from 'http'

export const requestHandler = async (req: http.IncomingMessage, res: ServerResponse) => {
  console.log(req.url)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', '*');
  try {
    const url: string = req.url!
    if (url === '/') {
      const httpRequest = new HttpRequest(url, req.method!)
      const body: any = await httpRequest.getRequest()
      res.end(body)
    } else if (url === '/cars/'){
      console.log('hit cars')
      const httpRequest = new HttpRequest(url, req.method!)
      const body: any = await httpRequest.getRequest()
      res.end(body)
    }else {
      res.statusCode = 401
      res.end('{"message": "go away"}')
    }
  } catch (err) {
    res.statusCode = 400
    res.end(new Error(err))
  }
}

const authServer = http.createServer(requestHandler)

authServer.listen(8000, () => {
  console.log('server started on port 8000')
})
