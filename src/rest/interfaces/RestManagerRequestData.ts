import { RestRequestMethods } from '@src/constants'
import { RawAttachment } from '@src/rest/interfaces/RawAttachment'

export interface RestManagerRequestData {
  method: RestRequestMethods
  path: string
  attachments?: RawAttachment[]
  body?: Record<any, any>
  headers?: Record<string, any>
  majorParameter?: string
}
