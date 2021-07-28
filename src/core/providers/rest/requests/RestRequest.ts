import { RestRequestMethods } from '@src/constants'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { RestManager } from '@src/rest/RestManager'

/** Constructor used to build and perform requests to discord rest api */
export interface RestRequest {
  /** RestProvider to perform requests */
  rest: RestManager

  /** Url parts */
  requestStack: string[]

  /** Query to be built */
  requestQuery: Record<string, string>

  /** Headers that will be attached to the request */
  requestHeaders: Record<string, any>

  /** Request payload data */
  requestPayload: any

  /** Major parameter of this request, used for rate limits processing */
  majorParameter: string | undefined

  /** Request endpoint url */
  endpoint: string

  /**
   * Add part(s) to the endpoint
   * @param parts - parts to add
   */
  url(...parts: string[]): RestRequest

  /**
   * Add query data
   * @param k - key
   * @param v - value
   */
  query(k: string, v: any): RestRequest

  /**
   * Add headers to request
   * @param headers - request headers
   */
  headers(headers: Record<string, any>): RestRequest

  /**
   * Add payload data to request
   * @param data - request headers
   */
  payload(data: any): RestRequest

  /**
   * Perform a request
   * @param method - method to use
   * @param options - request options
   */
  // TODO: RestRequestOptions
  request<T = any>(method: RestRequestMethods, options?: any): RestRequestResponse<T>

  /**
   * Perform GET request
   * @param options - request options
   */
  get<T = any>(options?: any): RestRequestResponse<T>

  /**
   * Perform POST request
   * @param options - request options
   */
  post<T = any>(options?: any): RestRequestResponse<T>

  /**
   * Perform PATCH request
   * @param options - request options
   */
  patch<T = any>(options?: any): RestRequestResponse<T>

  /**
   * Perform PUT request
   * @param options - request options
   */
  put<T = any>(options?: any): RestRequestResponse<T>

  /**
   * Perform DELETE request
   * @param options - request options
   */
  delete<T = any>(options?: any): RestRequestResponse<T>
}
