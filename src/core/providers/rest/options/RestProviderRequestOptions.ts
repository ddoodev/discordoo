import { RestRequestMethods } from '@src/core/Constants'

export interface RestProviderRequestOptions {
  method: RestRequestMethods
  payload?: any
  headers?: Record<string, any>
  endpoint: string
  options?: any
}
