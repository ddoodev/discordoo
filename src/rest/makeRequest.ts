import { RestRequest } from '@src/core/providers/rest/requests/RestRequest'
import { RestProvider } from '@src/core/providers/rest/RestProvider'
import { API_ENDPOINT, RestRequestMethods } from '@src/core/Constants'
import { RestRequestResponse } from '@src/core/providers/rest/RestRequestResponse'

export function makeRequest(rest: RestProvider): RestRequest {

  return {
    rest,

    requestQuery: {},
    requestStack: [],
    requestHeaders: {},
    requestPayload: undefined,

    get endpoint() {
      let path = `${API_ENDPOINT}/${this.requestStack.join('/')}`
      if (Object.keys(this.requestQuery).length > 0) {
        path += new URLSearchParams(this.requestQuery).toString()
      }
      return path
    },

    request<T = any>(method: RestRequestMethods, options?: any): RestRequestResponse<T> {
      return this.rest.request({
        method,
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
