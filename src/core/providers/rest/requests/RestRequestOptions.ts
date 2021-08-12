import { AuthLike } from '@src/core/providers/rest/AuthLike'

export interface RestRequestOptions {
  reason?: string
  auth?: AuthLike
}
