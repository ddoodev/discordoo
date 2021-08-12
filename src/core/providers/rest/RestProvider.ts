import { RestRequestData } from '@src/core/providers/rest/requests/RestRequestData'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { Provider } from '@src/core/providers/Provider'
import { RestRequestOptions } from '@src/core/providers/rest/requests/RestRequestOptions'

/**
 * Represents a rest provider. Custom rest modules must implement it
 * */
export interface RestProvider extends Provider {

  /**
   * Perform a request
   * @param data - request data
   * */
  request<T = any>(data: RestRequestData, options?: RestRequestOptions): Promise<RestRequestResponse<T>>

}
