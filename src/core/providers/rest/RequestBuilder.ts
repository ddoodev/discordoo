import { RequestOptions } from '@src/core/providers/rest/RequestOptions'
import { RESTResponse } from '@src/core/providers/rest/RESTResponse'

/** Represents a request builder */
export interface RequestBuilder {
  /**
   * Add part(s) to the URI
   * @param paths - paths
   */
  url(...paths: string[]): RequestBuilder

  /**
   * Add query data
   * @param k - key
   * @param v - value
   */
  query(k: string, v: string): RequestBuilder

  /**
   * Create GET request
   * @param options - options
   */
  get<T>(options?: RequestOptions): Promise<RESTResponse<T>>

  /**
   * Create POST request
   * @param options - options
   */
  post<T>(options?: RequestOptions): Promise<RESTResponse<T>>

  /**
   * Create DELETE request
   * @param options - options
   */
  delete<T>(options?: RequestOptions): Promise<RESTResponse<T>>

  /**
   * Create PUT request
   * @param options - options
   */
  put<T>(options?: RequestOptions): Promise<RESTResponse<T>>

  /**
   * Create PATCH request
   * @param options - options
   */
  patch<T>(options?: RequestOptions): Promise<RESTResponse<T>>
}
