import { RestProviderRequestOptions } from '@src/core/providers/rest/options/RestProviderRequestOptions'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { Provider } from '@src/core/providers/Provider'

/**
 * Represents a rest provider. Custom rest modules must implement it
 * */
export interface RestProvider extends Provider {

  /**
   * Perform a request
   * @param options - request options
   * */
  request<T = any>(options: RestProviderRequestOptions): RestRequestResponse<T>

}
