import { RestRequestMethods } from '@src/constants'

export interface RestProviderRequestData {
  method: RestRequestMethods
  endpoint: string
  payload?: any
  headers?: Record<string, any>
  reason?: string
}
