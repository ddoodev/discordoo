import { AuthLike } from '@src/core/providers/rest/AuthLike'

export interface RestOptions {
  maxRetries?: number
  userAgent?: string
  version?: number
  requestTimeout?: number
  latencyThreshold?: number
  domain?: string
  scheme?: 'http' | 'https'
  headers?: Record<string, any>
  auth?: AuthLike
}
