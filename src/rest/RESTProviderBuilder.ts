import RESTOptions from '@src/rest/RESTOptions'
import { Client, Constants, RESTProvider } from '@src/core'
import RESTRequestBuilder from '@src/rest/RESTRequestBuilder'
import RESTClient from '@src/rest/RESTClient'

/** Builds a RestProvider for {@link Client} */
export default class RESTProviderBuilder {
  /** {@link RESTClient} used by this builder */
  client: RESTClient

  /**
   * @param options - builder's options
   */
  constructor(
    options: RESTOptions = Constants.DEFAULT_REST_OPTIONS
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
