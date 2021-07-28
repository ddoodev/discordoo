import { RestRequest } from '@src/core/providers/rest/requests/RestRequest'
import { DISCORD_API_ENDPOINT, RestRequestMethods } from '@src/constants'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'
import { RestManager } from '@src/rest/RestManager'

/**
 * Creates a new rest request. We do not use classes here, because function+object is about 9x faster than new Class()
 * */
export function makeRequest(rest: RestManager<any>): RestRequest {

  return {
    rest,

    requestQuery: {},
    requestStack: [],
    requestHeaders: {},
    requestPayload: undefined,

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

    get endpoint() {
      let path = `${DISCORD_API_ENDPOINT}/${this.requestStack.join('/')}`
      if (Object.keys(this.requestQuery).length > 0) {
        path += '&' + new URLSearchParams(this.requestQuery).toString()
      }
      return path
    },

    request<T = any>(method: RestRequestMethods, options?: any): RestRequestResponse<T> {
      return this.rest.request({
        method,
        majorParameter: this.majorParameter,
        endpoint: this.endpoint,
        headers: this.requestHeaders,
        payload: this.requestPayload,
        options
      })
    },

    get<T = any>(options?: any): RestRequestResponse<T> {
      return this.request(RestRequestMethods.GET, options)
    },

    delete<T = any>(options?: any): RestRequestResponse<T> {
      return this.request(RestRequestMethods.DELETE, options)
    },

    patch<T = any>(options?: any): RestRequestResponse<T> {
      return this.request(RestRequestMethods.PATCH, options)
    },

    post<T = any>(options?: any): RestRequestResponse<T> {
      return this.request(RestRequestMethods.POST, options)
    },

    put<T = any>(options?: any): RestRequestResponse<T> {
      return this.request(RestRequestMethods.PUT, options)
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

    payload(data: any): RestRequest {
      this.requestPayload = data

      return this
    },
  }

}
