import { RestProviderRequestOptions } from '@src/core/providers/rest/options/RestProviderRequestOptions'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { RestRequest } from '@src/core/providers/rest/requests/RestRequest'

/**
 * Represents a rest provider. Custom rest modules must implement it
 * */
export interface RestProvider {

  /**
   * Make new rest request
   * */
  get api(): RestRequest

  /**
   * Perform a request
   * @param options - request options
   * */
  request<T = any>(options: RestProviderRequestOptions): RestRequestResponse<T>

}
