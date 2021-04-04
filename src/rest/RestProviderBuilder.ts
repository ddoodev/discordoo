import RESTOptions from './RESTOptions'
import { version } from '../../package.json'
import { Client, RequestBuilder, RESTProvider } from '../core'
import RESTRequestBuilder from './RESTRequestBuilder'

/** Builds a RestProvider for {@link Client} */
export default class RestProviderBuilder {
  /** Options for this builder */
  options: RESTOptions

  /**
   * @param options - builder's options
   */
  constructor(
    options: RESTOptions = {
      v: 8,
      useragent: `DiscordBot (https://discordoo.xyz, ${version})`,
      maxRetries: 5
    }
  ) {
    this.options = options
  }

  /** Get rest provider */
  getRestProvider(): (client: Client) => RESTProvider {
    const options = this.options // this.options is shadowed in nested function

    return (client: Client) => function (): RequestBuilder {
      return new RESTRequestBuilder(client.token, options)
    }
  }

}
