import { MultipartData } from '@src/utils/MultipartData'
import { Client as Undici, request } from 'undici'
import { DiscordooError } from '@src/utils'
import { Client } from '@src/core'
import { RestFinishedResponse, RestProvider, RestRequestData, RestRequestOptions } from '@discordoo/providers'
import { CompletedRestOptions } from '@src/rest'
import * as process from 'process'

export class DefaultRestProvider implements RestProvider {
  public client: Client
  public options: CompletedRestOptions
  private readonly undici: Undici

  constructor(client: Client, options: CompletedRestOptions) {
    this.client = client
    this.options = options
    this.undici = new Undici(`${this.options.api.scheme}://${this.options.api.domain}/`)
  }

  async init(): Promise<unknown> {
    return undefined
  }

  async request<T = any>(data: RestRequestData, options: RestRequestOptions = {}): RestFinishedResponse<T> {

    let headers = this.options.api.headers

    headers['Authorization'] = options.auth ?? this.options.api.auth

    if (this.options.userAgent) {
      headers['User-Agent'] = this.options.userAgent
    }

    if (options.reason) {
      headers['X-Audit-Log-Reason'] = options.reason
    }

    if (data.headers) {
      headers = { ...headers, ...data.headers }
    }

    let body: string | Buffer | undefined

    if (data.attachments.length) {
      const multipart = new MultipartData()
      headers['Content-Type'] = 'multipart/form-data; boundary=' + multipart.boundary

      if (data.attachments.length === 1) {
        const attachment = data.attachments[0]

        multipart.attach('file', attachment.data, attachment.name)
      } else {
        data.attachments.forEach(attachment => {
          multipart.attach(attachment.name, attachment.data, attachment.name)
        })
      }

      if (data.body) {
        multipart.attach('payload_json', JSON.stringify(data.body))
      }

      body = multipart.finish()
    } else if (data.body) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(data.body)
    }

    // console.log('PROVIDER REQUEST:', data)

    const before = process.hrtime.bigint()
    const response = await request(
      `${this.options.api.scheme}://${this.options.api.domain}${this.options.api.path}${this.options.api.version}/${data.path}`,
      {
      dispatcher: this.undici,
      method: data.method,
      body,
      headers,
      headersTimeout: this.options.requestTimeout,
      bodyTimeout: this.options.requestTimeout,
    })
    const after = process.hrtime.bigint()

    let result: any = await response.body.text(),
      success = response.statusCode > 199 && response.statusCode < 400

    // console.log('PROVIDER REQUEST EXECUTED, SUCCESS:', success, 'DATA:', response)

    try {
      if (response.statusCode !== 204) result = JSON.parse(result)
    } catch (e) {
      success = false
      // TODO: use RestError here
      result = new DiscordooError('DefaultRestProvider#request', 'failed to parse response:', result)
    }

    return {
      success,
      result,
      statusCode: response.statusCode,
      headers: response.headers,
      latency: Number(after - before) / 1_000_000,
    }
  }

}
