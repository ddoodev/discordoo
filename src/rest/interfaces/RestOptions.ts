import { AuthLike } from '@discordoo/providers'
import { AllowedImageFormats } from '@src/utils'

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
  defaultImageFormat?: AllowedImageFormats
  rateLimits?: {
    disable?: boolean
    globalLimit?: number
    invalidLimit?: number
  }
}
