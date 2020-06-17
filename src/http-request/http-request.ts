import * as http from 'http'

export class HttpRequest {
  private hostname: string = 'localhost'
  private port: number = 5984
  public path: string
  public method: string
  public postData: string

  constructor (path: string, method: string, postData: string = '') {
    this.path = path
    this.method = method
    this.postData = postData
  }

  private options (): http.RequestOptions {
    return {
      hostname: this.hostname,
      port: this.port,
      path: this.path,
      method: this.method
    }
  }

  public getRequest () {
    return HttpRequest.getRequest(this.options(), this.postData)
  }

  public static getRequest (options: http.RequestOptions, postData?: string) {
    return new Promise((resolve, reject) => {
      var req = http.request((options), (res: http.IncomingMessage) => {
        const statusCode: number = res.statusCode!
        if (statusCode < 200 || statusCode >= 300) {
          return reject(new Error(`statusCode=${res.statusCode!}`))
        }
        var body: Array<Uint8Array> = []
        res.on('data', (chunk: Uint8Array) => {
          body.push(chunk)
        })
        res.on('end', () => {
          try {
            resolve(Buffer.concat(body).toString())
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
}
