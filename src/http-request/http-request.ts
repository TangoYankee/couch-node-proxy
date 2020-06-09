import * as http from 'http'

export const httpRequest = (options:http.RequestOptions, postData?:string) => {
  return new Promise((resolve, reject) => {
    var req = http.request((options), (res: http.IncomingMessage) => {
      if (res.statusCode! < 200 || res.statusCode! >= 300) {
        return reject(new Error(`statusCode=${res.statusCode!}`))
      }
      var body:Array<Uint8Array> = []
      res.on('data', (chunk: Uint8Array) => {
        body.push(chunk)
      })
      res.on('end', () => {
        try {
          const bodyJSON = JSON.parse(Buffer.concat(body).toString())
          resolve(bodyJSON)
        } catch (e) {
          reject(e)
        }
      })
    })
    req.on('error', (err) => {
      reject(err)
    })
    if (postData) {
      req.write(postData)
    }
    req.end()
  })
}
