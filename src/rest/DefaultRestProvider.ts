import { MultipartData } from '@src/utils/MultipartData'
import { DiscordooError } from '@src/utils'
import { RestFinishedResponse, RestProvider, RestRequestData, RestRequestOptions } from '@discordoo/providers'
import { CompletedRestOptions } from '@src/rest'
import * as process from 'process'
import { AnyDiscordApplication } from '@src/core/apps/AnyDiscordApplication'

export class DefaultRestProvider implements RestProvider {
  public readonly app: AnyDiscordApplication
  public readonly options: CompletedRestOptions

  constructor(app: AnyDiscordApplication, options: CompletedRestOptions) {
    this.app = app
    this.options = options
  }

  async init(): Promise<unknown> {
    return undefined
  }

  async request<T = any>(data: RestRequestData, options: RestRequestOptions = {}): RestFinishedResponse<T> {

    let headers = this.options.api.headers ?? {}

    if (options.useAuth !== false) headers['Authorization'] = options.auth ?? this.options.api.auth

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

    if (data.attachments?.length) {
      const multipart = new MultipartData()
      headers['Content-Type'] = 'multipart/form-data; boundary=' + multipart.boundary

      if (data.attachments.length === 1) {
        const [ attachment ] = data.attachments
        multipart.attach('file', attachment.data, attachment.name)
      } else {
        data.attachments.forEach((attachment, index) => {
          multipart.attach(`files[${index}]`, attachment.data, attachment.name)
        })
      }

      if (data.body) {
        if (options.bodyAsMultipart) {
          for (const key in data.body) {
            multipart.attach(key, data.body[key])
          }
        } else {
          multipart.attach('payload_json', JSON.stringify(data.body))
        }
      }

      body = multipart.finish()
    } else if (data.body) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(data.body)
    }

    // console.log('PROVIDER REQUEST:',
    //   `${this.options.api.scheme}://${this.options.api.domain}${this.options.api.path}${this.options.api.version}/${data.path}`,
    //   {
    //     method: data.method,
    //     body,
    //     headers,
    //     headersTimeout: this.options.requestTimeout,
    //     bodyTimeout: this.options.requestTimeout,
    //   }
    //   )

    const before = process.hrtime.bigint()

    const abortController = new AbortController()

    if (this.options.requestTimeout) {
      /**
       * we use setTimeout because the internal implementation of undici
       * which was used before updating discordoo to the latest LTS node also uses setTimeout:
       * https://github.com/nodejs/undici/blob/ba4ca327843de62a83c1f9c32acc303bd6b8545f/lib/core/connect.js#L160
       * therefore, there is no difference in performance
       */
      setTimeout(() => {
        abortController.abort()
      }, this.options.requestTimeout)
    }

    const response = await fetch(
      `${this.options.api.scheme}://${this.options.api.domain}${this.options.api.path}${this.options.api.version}/${data.path}`,
      {
      method: data.method,
      body,
      headers,
      redirect: 'follow',
      signal: abortController.signal
    })
    const after = process.hrtime.bigint()

    let result: any = await response.text(),
      success = response.status > 199 && response.status < 400

    // console.log('PROVIDER REQUEST EXECUTED, SUCCESS:', success, 'DATA:', response, 'BODY:', result)

    try {
      if (response.status !== 204) result = JSON.parse(result)
    } catch (e) {
      success = false
      // TODO: use RestError here
      result = new DiscordooError('DefaultRestProvider#request', 'failed to parse response:', result)
    }

    return {
      success,
      result,
      statusCode: response.status,
      headers: response.headers,
      latency: Number(after - before) / 1_000_000,
    }
  }

}
