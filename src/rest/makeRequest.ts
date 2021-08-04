import { RestRequest } from '@src/core/providers/rest/requests/RestRequest'
import { RestRequestMethods } from '@src/constants'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { RestManager } from '@src/rest/RestManager'
import { RawAttachment } from '@src/rest/interfaces/RawAttachment'

/**
 * Creates a new rest request. We do not use classes here, because function+object is about 9x faster than new Class()
 * */
export function makeRequest(rest: RestManager<any>): RestRequest {

  return {
    rest,

    requestQuery: {},
    requestStack: [],
    requestHeaders: {},
    requestBody: {},
    requestPayload: [],

    get majorParameter() {
      const guilds = this.requestStack.indexOf('guilds'),
        channels = this.requestStack.indexOf('channels'),
        webhooks = this.requestStack.indexOf('webhooks')

      switch (true) {
        case webhooks > -1:
          return this.requestStack[webhooks + 1] + this.requestStack[webhooks + 2]
        case guilds > -1:
          return this.requestStack[guilds + 1]
        case channels > -1:
          return this.requestStack[channels + 1]
      }
    },

    get path() {
      const path = `${this.requestStack.join('/')}`

      if (Object.keys(this.requestQuery).length > 0) {
        return path + '&' + new URLSearchParams(this.requestQuery).toString()
      }

      return path
    },

    query(k: string, v: any): RestRequest {
      this.requestQuery[encodeURIComponent(k)] = encodeURIComponent(v)

      return this
    },

    headers(headers: Record<string, any>): RestRequest {
      this.requestHeaders = { ...this.requestHeaders, ...headers }

      return this
    },

    url(...parts: string[]): RestRequest {
      this.requestStack.push(...parts.map(p => encodeURIComponent(p)))

      return this
    },

    body(body: Record<any, any>): RestRequest {
      this.requestBody = { ...this.requestBody, ...body }

      return this
    },

    attach(...attachments: RawAttachment[]): RestRequest {
      this.requestPayload.push(...attachments)

      return this
    },

    request<T = any>(method: RestRequestMethods, options?: any): Promise<RestRequestResponse<T>> {
      return this.rest.request<T>({
        method,
        path: this.path,
        attachments: this.requestPayload,
        body: Object.keys(this.requestBody).length ? this.requestBody : undefined,
        headers: Object.keys(this.requestHeaders).length ? this.requestHeaders : undefined,
        majorParameter: this.majorParameter,
      }, options)
    },

    get<T = any>(options?: any): Promise<RestRequestResponse<T>> {
      return this.request(RestRequestMethods.GET, options)
    },

    delete<T = any>(options?: any): Promise<RestRequestResponse<T>> {
      return this.request(RestRequestMethods.DELETE, options)
    },

    patch<T = any>(options?: any): Promise<RestRequestResponse<T>> {
      return this.request(RestRequestMethods.PATCH, options)
    },

    post<T = any>(options?: any): Promise<RestRequestResponse<T>> {
      return this.request(RestRequestMethods.POST, options)
    },

    put<T = any>(options?: any): Promise<RestRequestResponse<T>> {
      return this.request(RestRequestMethods.PUT, options)
    },
  }

}
