import { RestProvider } from '@src/core/providers/rest/RestProvider'
import { RestProviderRequestData } from '@src/core/providers/rest/RestProviderRequestData'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { Client } from '@src/core'
import { Client as Undici, request } from 'undici'
import { DiscordooError } from '@src/utils'
import { RestOptions } from '@src/rest/interfaces/RestOptions'
import { MultipartData } from '@src/utils/MultipartData'

export class DefaultRestProvider implements RestProvider {
  public client: Client
  public options: Required<RestOptions>
  private readonly undici: Undici

  constructor(client: Client, options: Required<RestOptions>) {
    this.client = client
    this.options = options
    this.undici = new Undici(`${this.options.scheme}://${this.options.domain}/`)
  }

  async init(): Promise<unknown> {
    return void 0
  }

  async request<T = any>(data: RestProviderRequestData): Promise<RestRequestResponse<T>> {

    let headers = this.options.headers

    headers['Authorization'] = data.auth ?? this.options.auth

    if (this.options.userAgent) {
      headers['User-Agent'] = this.options.userAgent
    }

    if (data.reason) {
      headers['X-Audit-Log-Reason'] = data.reason
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

    const response = await request(`${this.options.scheme}://${this.options.domain}/api/v${this.options.version}/${data.path}`, {
      dispatcher: this.undici,
      method: data.method,
      body,
      headers,
    })

    // https://github.com/nodejs/undici/commit/b08399d3285f9ec78831823627f0bf49ab009bdc
    // @ts-ignore
    let result = await response.body.text(),
      success = response.statusCode > 199 && response.statusCode < 400

    // console.log('PROVIDER REQUEST EXECUTED, SUCCESS:', success, 'DATA:', response)

    try {
      result = JSON.parse(result)
    } catch (e) {
      success = false
      // TODO: use RestError here
      result = new DiscordooError('DefaultRestProvider#request', 'failed to parse response:', result)
    }

    return {
      success,
      result,
      statusCode: response.statusCode,
      headers: response.headers
    }
  }

}
