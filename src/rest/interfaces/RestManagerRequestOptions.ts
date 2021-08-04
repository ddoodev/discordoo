import { AuthLike } from '@src/core/providers/rest/AuthLike'

export interface RestManagerRequestOptions {
  reason?: string
  auth?: AuthLike
}
