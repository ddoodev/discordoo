import { RestProvider } from '@src/core/providers/rest/RestProvider'
import { RestProviderRequestData } from '@src/core/providers/rest/options/RestProviderRequestData'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { Client } from '@src/core'
import { Client as Undici, request } from 'undici'
import { DiscordooError } from '@src/utils'
import { REST_DEFAULT_OPTIONS } from '@src/constants'

export class DefaultRestProvider implements RestProvider {
  public client: Client
  private readonly undici: Undici

  constructor(client: Client) {
    this.client = client
    this.undici = new Undici('https://discord.com/')
  }

  async init(): Promise<unknown> {
    return void 0
  }

  async request<T = any>(data: RestProviderRequestData): RestRequestResponse<T> {
    const response = await request('https://discord.com/api/' + data.endpoint, {
      dispatcher: this.undici,
      method: data.method,
      headers: Object.assign(data.headers ?? {}, REST_DEFAULT_OPTIONS)
    })

    const { body, statusCode, headers } = response

    // https://github.com/nodejs/undici/commit/b08399d3285f9ec78831823627f0bf49ab009bdc
    // @ts-ignore
    const responseData = await body.text()

    let success = statusCode > 199 && statusCode < 400, result

    try {
      result = JSON.parse(responseData)
    } catch (e) {
      success = false
      throw new DiscordooError( // TODO: DiscordApiError
        'DefaultRestProvider#request',
        'Error when parsing response for',
        '/' + data.endpoint + '.',
        'Unexpected response:',
        responseData
        )
    }

    return {
      success,
      headers,
      statusCode,
      result: result ?? null
    }
  }

}
