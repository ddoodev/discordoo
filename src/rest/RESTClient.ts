import { RESTOptions } from '@src/rest/RESTOptions'
import { RESTRequestBuilder } from '@src/rest/RESTRequestBuilder'
import { DEFAULT_REST_OPTIONS } from '@src/core/Constants'

/** Helps to send requests to Discord */
export class RESTClient {
  /**
   * @param token - token to use in requests
   * @param options - options
   */
  constructor(public token: string, public options: RESTOptions = DEFAULT_REST_OPTIONS) {}

  /** Create a request */
  request(tokenOverride?: string): RESTRequestBuilder {
    return new RESTRequestBuilder(tokenOverride ?? this.token, this.options)
  }
}
