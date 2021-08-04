import { RestRequestMethods } from '@src/constants'
import { RawAttachment } from '@src/rest/interfaces/RawAttachment'
import { AuthLike } from '@src/core/providers/rest/AuthLike'

export interface RestManagerRequestData {
  method: RestRequestMethods
  path: string
  attachments?: RawAttachment[]
  body?: Record<any, any>
  headers?: Record<string, any>
  majorParameter?: string
  reason?: string
  auth?: AuthLike
}
