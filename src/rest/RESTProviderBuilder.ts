import RESTOptions from '@src/rest/RESTOptions'
import { Client, RESTProvider } from '@src/core'
import RESTRequestBuilder from '@src/rest/RESTRequestBuilder'
import RESTClient from '@src/rest/RESTClient'
import { DEFAULT_REST_OPTIONS } from '@src/core/Constants'

/** Builds a RestProvider for {@link Client} */
export default class RESTProviderBuilder {
  /** {@link RESTClient} used by this builder */
  client: RESTClient

  /**
   * @param options - builder's options
   */
  constructor(
    options: RESTOptions = DEFAULT_REST_OPTIONS
  ) {
    this.client = new RESTClient('random token, because it will be overridden', options)
  }

  /** Get rest provider */
  getRestProvider(): (client: Client) => RESTProvider {
    const restClient = this.client // this is shadowed

    return (client: Client) => function(): RESTRequestBuilder {
      return restClient.request(client.token)
    }
  }
}
