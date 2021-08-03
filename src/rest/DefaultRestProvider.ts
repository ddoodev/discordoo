import { RestProvider } from '@src/core/providers/rest/RestProvider'
import { RestProviderRequestOptions } from '@src/core/providers/rest/options/RestProviderRequestOptions'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { Client } from '@src/core'
import { Client as Undici, request } from 'undici'
import { DiscordooError } from '@src/utils'

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

  async request<T = any>(options: RestProviderRequestOptions): RestRequestResponse<T> {
    const {
      statusCode,
      body
    } = await request('https://discord.com/api/' + options.endpoint, {
      dispatcher: this.undici,
      method: options.method
    })

    // https://github.com/nodejs/undici/commit/b08399d3285f9ec78831823627f0bf49ab009bdc
    // @ts-ignore
    const response = await body.text(),
      success = statusCode > 199 && statusCode < 300

    let json
    try {
      json = JSON.parse(response)
    } catch (e) {
      throw new DiscordooError( // TODO: DiscordApiError
        'DefaultRestProvider#request',
        'Error when parsing response for',
        '/' + options.endpoint + '.',
        'Unexpected response:',
        response
        )
    }

    return {
      success,
      result: json ?? null
    } as any
  }

}
