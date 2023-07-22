import {
  RestRequestMethods,
  RawAttachment
} from '../../../../providers/src/_index'

export interface RestManagerRequestData {
  method: RestRequestMethods
  path: string
  attachments?: RawAttachment[]
  body?: Record<any, any>
  headers?: Record<string, any>
  majorParameter?: string
}
