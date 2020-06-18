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
    } else if (url === '/cars/') {
      console.log('hit cars')
      const httpRequest = new HttpRequest(url, req.method!)
      const body: any = await httpRequest.getRequest()
      res.end(body)
    } else {
      res.statusCode = 401
      res.end('{"message": "go away"}')
    }
  } catch (err) {
    res.statusCode = 400
    res.end(new Error(err))
  }
}

const authServer = http.createServer(requestHandler)

// authServer.listen(8000, () => {
//   console.log('server started on port 8000')
// })

const couchDomain = 'localhost'
const couchPort = 5984

const proxyHandler = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');

  var auth: string = req.headers.authorization ? 'creds' : 'anon'
  var proxyReqHeaders = JSON.parse(JSON.stringify(req.headers))
  proxyReqHeaders.host = `${couchDomain}:${couchPort}`
  proxyReqHeaders.origin = 'http://localhost:3000'
  // proxyReqHeaders.setHeader('Forwarded', 'for')
  console.log('proxy headers')
  console.log(proxyReqHeaders)
  var options = {
    // host: couchDomain,
    port: couchPort,
    headers: proxyReqHeaders,
    method: JSON.parse(JSON.stringify(req.method)),
    path: JSON.parse(JSON.stringify(req.url))
  }
  var body:any
  try {
    body = await HttpRequest.getRequest(options)
    console.info(body)
  } catch (error) {
    body = JSON.stringify({error: error.message})
    console.info(body)
  } finally{
    res.end(body)
  }
}

const proxyServer = http.createServer(proxyHandler)

proxyServer.listen(3000, () => {
  console.log('proxy server started on port 3000')
})
