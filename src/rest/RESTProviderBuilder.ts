import RESTOptions from '@src/rest/RESTOptions'
import { Client, Constants, RequestBuilder, RESTProvider } from '@src/core'
import RESTRequestBuilder from '@src/rest/RESTRequestBuilder'

/** Builds a RestProvider for {@link Client} */
export default class RESTProviderBuilder {
  /** Options for this builder */
  options: RESTOptions

  /**
   * @param options - builder's options
   */
  constructor(
    options: RESTOptions = Constants.DEFAULT_REST_OPTIONS
  ) {
    this.options = options
  }

  /** Get rest provider */
  getRestProvider(): (client: Client) => RESTProvider {
    const options = this.options // this.options is shadowed in nested function

    return (client: Client) => function(): RequestBuilder {
      return new RESTRequestBuilder(client.token, options)
    }
  }
}
