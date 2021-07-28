import { RestRequestMethods } from '@src/constants'

export interface RestManagerRequestOptions {
  method: RestRequestMethods
  payload?: any
  headers?: Record<string, any>
  endpoint: string
  majorParameter?: string
  options?: any
}
