import { RestProviderRequestData } from '@src/core/providers/rest/options/RestProviderRequestData'
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
  request<T = any>(options: RestProviderRequestData): RestRequestResponse<T>

}
