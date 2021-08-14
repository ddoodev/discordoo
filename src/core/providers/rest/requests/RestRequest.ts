import { RestRequestMethods } from '@src/constants'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { RestManager } from '@src/rest/RestManager'
import { RawAttachment } from '@src/rest/interfaces/RawAttachment'
import { RestRequestOptions } from '@src/core/providers/rest/requests/RestRequestOptions'

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

  /** Request body data */
  requestBody: Record<any, any>

  /** Request payload data (attachments) */
  requestPayload: RawAttachment[]

  /** Major parameter of this request, used for rate limits processing */
  majorParameter?: string

  /** Request path */
  path: string

  /**
   * Add part(s) to the request path
   * @param parts - parts to add
   */
  url(...parts: Array<string | string[]>): RestRequest

  /**
   * Add query data
   * @param data - query data
   */
  query(data: Record<string, any>): RestRequest

  /**
   * Add headers to request
   * @param headers - request headers
   */
  headers(headers: Record<string, any>): RestRequest

  /**
   * Add body data to request
   * @param body - body data
   * */
  body(body: Record<any, any>): RestRequest

  /**
   * Add payload data to request
   * @param attachments - raw attachments
   */
  attach(...attachments: RawAttachment[]): RestRequest

  /**
   * Perform a request
   * @param method - method to use
   * @param options - request options
   */
  request<T = any>(method: RestRequestMethods, options?: RestRequestOptions): Promise<RestRequestResponse<T>>

  /**
   * Perform GET request
   * @param options - request options
   */
  get<T = any>(options?: RestRequestOptions): Promise<RestRequestResponse<T>>

  /**
   * Perform POST request
   * @param options - request options
   */
  post<T = any>(options?: RestRequestOptions): Promise<RestRequestResponse<T>>

  /**
   * Perform PATCH request
   * @param options - request options
   */
  patch<T = any>(options?: RestRequestOptions): Promise<RestRequestResponse<T>>

  /**
   * Perform PUT request
   * @param options - request options
   */
  put<T = any>(options?: RestRequestOptions): Promise<RestRequestResponse<T>>

  /**
   * Perform DELETE request
   * @param options - request options
   */
  delete<T = any>(options?: RestRequestOptions): Promise<RestRequestResponse<T>>
}
