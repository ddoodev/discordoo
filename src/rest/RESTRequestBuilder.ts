import { RequestBuilder, RequestOptions, RESTResponse } from '@src/core'
import { URLSearchParams } from 'url'
import { RESTOptions } from '@src/rest/RESTOptions'
import fetch from 'node-fetch'
import { API_ENDPOINT, DEFAULT_REST_OPTIONS } from '@src/core/Constants'

/**
 * Create requests to Discord
 * @internal
 */
export class RESTRequestBuilder implements RequestBuilder {
  /** URI parts */
  private stack: string[] = []
  /** Query to be built */
  private queryStack: Record<string, string> = {}
  /** Retries done */
  private retries = 0

  /** Token of this request */
  public token: string
  /** Tokens used by this request */
  public options: RESTOptions

  /**
   * @param token - token to be used by this request
   * @param options - request options
   */
  constructor(token: string, options: RESTOptions) {
    this.token = token
    this.options = options

    this.stack.push(`v${options.v ?? DEFAULT_REST_OPTIONS.v}`)
  }

  /** Get headers */
  private getHeaders(headers?: Record<any, any>) {
    return {
      ...(headers ?? {}),
      'User-Agent': this.options.useragent,
      'Authorization': `Bot ${this.token}`,
      'Content-Type': 'application/json'
    }
  }

  /**
   * Add query data
   * @param k - key
   * @param v - value
   */
  query(k: string, v: any): RequestBuilder {
    this.queryStack[k] = v
    return this
  }

  /**
   * Add part(s) to the URI
   * @param paths - paths
   */
  url(...paths: string[]): RequestBuilder {
    this.stack.push(...paths)
    return this
  }

  /** URI request will be sent to */
  get endpoint() {
    let r = `${API_ENDPOINT}/${this.stack.join('/')}`
    if (Object.keys(this.queryStack).length > 0) {
      r += new URLSearchParams(this.queryStack).toString()
    }
    return r
  }

  /**
   * Create a request
   * @param method - method to be used
   * @param options - options
   */
  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    options: RequestOptions = {}
  ): Promise<RESTResponse<T>> {

    const resp = await fetch(this.endpoint, {
      method,
      body: method === 'GET' ? undefined : JSON.stringify(options.body ?? {}),
      headers: this.getHeaders(options.headers)
    })
    const body = await resp.json()

    if (resp.status === 429) {

      const seconds = +resp.headers.get('Retry-After')!
      setTimeout(async () => {
        return this.request(method, options)
      }, seconds * 60)

    } else if (resp.status < 500 && resp.status > 399) {
      return Promise.reject({
        statusCode: resp.status,
        reason: `Request on ${this.endpoint} ended with code ${resp.status}`
      })
    } else if (resp.status > 499) {

      if (this.retries < this.options.maxRetries) {
        this.retries++
        return this.request(method, options)
      } else {
        return Promise.reject({
          statusCode: resp.status,
          reason: `Too many retries on ${this.endpoint}. Code - ${resp.status}`
        })
      }

    }

    return Promise.resolve({
      body,
      statusCode: resp.status,
      headers: resp.headers
    })
  }

  /**
   * Create GET request
   * @param options - options
   */
  async get<T>(options: Omit<RequestOptions, 'body'> = {}): Promise<RESTResponse<T>> {
    return this.request('GET', options)
  }

  /**
   * Create POST request
   * @param options - options
   */
  async post<T>(options: RequestOptions = {}): Promise<RESTResponse<T>> {
    return this.request('POST', options)
  }

  /**
   * Create PATCH request
   * @param options - options
   */
  async patch<T>(options: RequestOptions = {}): Promise<RESTResponse<T>> {
    return this.request('PATCH', options)
  }

  /**
   * Create PUT request
   * @param options - options
   */
  async put<T>(options: RequestOptions = {}): Promise<RESTResponse<T>> {
    return this.request('PUT', options)
  }

  /**
   * Create DELETE request
   * @param options - options
   */
  async delete<T>(options: RequestOptions = {}): Promise<RESTResponse<T>> {
    return this.request('DELETE', options)
  }
}
