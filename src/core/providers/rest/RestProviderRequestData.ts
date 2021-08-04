import { RestRequestMethods } from '@src/constants'
import { RawAttachment } from '@src/rest/interfaces/RawAttachment'
import { AuthLike } from '@src/core/providers/rest/AuthLike'

export interface RestProviderRequestData {
  method: RestRequestMethods
  path: string
  attachments: RawAttachment[]
  body?: Record<any, any>
  headers?: Record<string, any>
  reason?: string
  auth?: AuthLike
}
