import RESTOptions from '@src/rest/RESTOptions'
import { Constants } from '@src/core'
import RESTRequestBuilder from '@src/rest/RESTRequestBuilder'

/** Helps to send requests to Discord */
export default class RESTClient {
  /**
   * @param token - token to use in requests
   * @param options - options
   */
  constructor(public token: string, public options: RESTOptions = Constants.DEFAULT_REST_OPTIONS) {}

  /** Create a request */
  request(tokenOverride?: string): RESTRequestBuilder {
    return new RESTRequestBuilder(tokenOverride ?? this.token, this.options)
  }
}