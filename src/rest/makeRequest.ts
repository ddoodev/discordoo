import { RestRequest, RestManager } from '@src/rest'
import {
  RawAttachment,
  RestFinishedResponse,
  RestRequestOptions,
  RestRequestMethods
} from '@discordoo/providers'
import { randomString } from '@src/utils'

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

    query(data: Record<string, any>): RestRequest {
      const entries = Object.entries(data)

      entries.forEach(([ key, value ]) => {
        this.requestQuery[encodeURIComponent(key)] = encodeURIComponent(value)
      })

      return this
    },

    headers(headers: Record<string, any>): RestRequest {
      this.requestHeaders = { ...this.requestHeaders, ...headers }

      return this
    },

    url(...parts: Array<string | string[]>): RestRequest {
      this.requestStack.push(...parts.flat().map(p => encodeURIComponent(p)))

      return this
    },

    body(body: any): RestRequest {
      this.requestBody = body

      return this
    },

    attach(...attachments: Array<Buffer | ArrayBuffer | RawAttachment>): RestRequest {
      this.requestPayload.push(
        ...attachments.map(file => {
          if (Buffer.isBuffer(file) || file instanceof ArrayBuffer) {
            return { name: `${randomString()}.png`, data: file }
          }

          return file
        })
      )

      return this
    },

    request<T = any>(method: RestRequestMethods, options?: RestRequestOptions): RestFinishedResponse<T> {
      return this.rest.request<T>({
        method,
        path: this.path,
        attachments: this.requestPayload,
        body: (typeof this.requestBody === 'object' && Object.keys(this.requestBody).length || Array.isArray(this.requestBody))
          ? this.requestBody
          : undefined,
        headers: Object.keys(this.requestHeaders).length ? this.requestHeaders : undefined,
        majorParameter: this.majorParameter,
      }, options)
    },

    get<T = any>(options?: RestRequestOptions): RestFinishedResponse<T> {
      return this.request(RestRequestMethods.GET, options)
    },

    delete<T = any>(options?: RestRequestOptions): RestFinishedResponse<T> {
      return this.request(RestRequestMethods.DELETE, options)
    },

    patch<T = any>(options?: RestRequestOptions): RestFinishedResponse<T> {
      return this.request(RestRequestMethods.PATCH, options)
    },

    post<T = any>(options?: RestRequestOptions): RestFinishedResponse<T> {
      return this.request(RestRequestMethods.POST, options)
    },

    put<T = any>(options?: RestRequestOptions): RestFinishedResponse<T> {
      return this.request(RestRequestMethods.PUT, options)
    },
  }

}
