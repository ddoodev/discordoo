import RESTOptions from '@src/rest/RESTOptions'
import { version } from '@root/package.json'
import { Client, RequestBuilder, RESTProvider } from '@src/core'
import RESTRequestBuilder from '@src/rest/RESTRequestBuilder'

/** Builds a RestProvider for {@link Client} */
export default class RESTProviderBuilder {
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
