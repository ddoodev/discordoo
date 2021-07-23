import { RestRequestMethods } from '@src/constants'

export interface RestProviderRequestOptions {
  method: RestRequestMethods
  payload?: any
  headers?: Record<string, any>
  endpoint: string
  options?: any
}
