import * as http from 'http'
import { HttpRequest } from './http-request/http-request'
import { ServerResponse } from 'http'

const Allowed_Origin = process.env.CLIENT_ORIGIN || null

export const requestHandler = async (req: http.IncomingMessage, res: ServerResponse) => {
  console.log(req.url)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', '*')
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
  res.setHeader('Access-Control-Allow-Origin', `${Allowed_Origin || '*'}`)
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type')
  // Header for cookie credentialing
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  var auth: string = req.headers.authorization ? 'creds' : 'anon'
  var proxyReqHeaders = JSON.parse(JSON.stringify(req.headers))
  proxyReqHeaders.host = `${couchDomain}:${couchPort}`
  proxyReqHeaders.origin = 'http://localhost:3000'
  // proxyReqHeaders.setHeader('Forwarded', 'for')
  if (Allowed_Origin) {
    console.info(`origin enforced with ${Allowed_Origin}`)
  } else {
    console.info('origin not enforced', Allowed_Origin)
  }
  var options = {
    // host: couchDomain,
    port: couchPort,
    headers: proxyReqHeaders,
    method: JSON.parse(JSON.stringify(req.method)),
    path: JSON.parse(JSON.stringify(req.url))
  }

  if (req.url === '/_session/' && req.method === 'POST') {
    console.debug("it's a cookie request!")
  }
  var proxyReqData: any = ''
  let clientReqBody: string = ''
  req.on('data', (chunk) => {
    clientReqBody += chunk
  })
  req.on('end', async () => {
    var body: any = ''
    try {
      console.log('enter request')
      let couchHeader:any
      [couchHeader, body] = await HttpRequest.getRequest(options, clientReqBody)
      console.log('otherside couch header', couchHeader)
      for (const key of Object.keys(couchHeader)) {
        res.setHeader(key, couchHeader[key])
      }
      res.setHeader('Access-Control-Allow-Origin', `${Allowed_Origin || '*'}`)
    } catch (error) {
      console.log('error')
      body = JSON.stringify({ error: error.message })
    } finally {
      res.end(body)
    }
  })
}

const proxyServer = http.createServer(proxyHandler)

proxyServer.listen(3000, () => {
  console.log('proxy server started on port 3000')
})
