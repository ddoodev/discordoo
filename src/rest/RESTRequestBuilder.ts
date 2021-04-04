import { Constants, RequestBuilder, RequestOptions, RESTResponse } from '../core'
import { URLSearchParams } from 'url'
import RESTOptions from './RESTOptions'
import fetch from 'node-fetch'

/**
 * Create requests to Discord
 *
 * @internal
 */
export default class RESTRequestBuilder implements RequestBuilder {
  private stack: string[] = []
  private queryStack: Record<string, string> = {}
  private retries = 0

  /** Token of this request */
  public token: string
  public options: RESTOptions

  constructor(token: string, options: RESTOptions) {
    this.token = token
    this.options = options

    this.stack.push(`v${options.v ?? 8}`)
  }

  private getHeaders(headers?: Record<any, any>) {
    return {
      ...(headers ?? {}),
      'User-Agent': this.options.useragent,
      'Authorization': `Bot ${this.token}`,
      'Content-Type': 'application/json'
    }
  }

  query(k: string, v: string): RequestBuilder {
    this.queryStack[k] = v
    return this
  }

  url(...paths: string[]): RequestBuilder {
    this.stack.push(...paths)
    return this
  }

  get endpoint() {
    let r = `${Constants.API_ENDPOINT}/${this.stack.join('/')}`
    if (Object.keys(this.queryStack).length > 0) {
      r += new URLSearchParams(this.queryStack).toString()
    }
    return r
  }

  request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    options: RequestOptions = {}
  ): Promise<RESTResponse<T>> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const resp = await fetch(this.endpoint, {
        method,
        body: method === 'GET' ? undefined : JSON.stringify(options.body ?? {}),
        headers: this.getHeaders(options.headers)
      })
      const body = await resp.json()

      if (resp.status === 429) {
        const seconds = +resp.headers.get('Retry-After')!
        setTimeout(async () => {
          resolve(await this.request(method, options))
        }, seconds * 60)
      } else if (resp.status < 500 && resp.status > 399) {
        reject(`Request on ${this.endpoint} ended with code ${resp.status}`)
      } else if (resp.status > 499) {
        if (this.retries < this.options.maxRetries) {
          this.retries++
          resolve(await this.request(method, options))
        } else {
          reject(`Too many retries on ${this.endpoint}. Code - ${resp.status}`)
        }
      }

      resolve({
        body,
        statusCode: resp.status,
        headers: resp.headers
      })
    })
  }

  async get<T>(options: Omit<RequestOptions, 'body'> = {}): Promise<RESTResponse<T>> {
    return this.request('GET', options)
  }

  async post<T>(options: RequestOptions = {}): Promise<RESTResponse<T>> {
    return this.request('POST', options)
  }

  async patch<T>(options: RequestOptions = {}): Promise<RESTResponse<T>> {
    return this.request('PATCH', options)
  }

  async put<T>(options: RequestOptions = {}): Promise<RESTResponse<T>> {
    return this.request('PUT', options)
  }

  async delete<T>(options: RequestOptions = {}): Promise<RESTResponse<T>> {
    return this.request('DELETE', options)
  }
}