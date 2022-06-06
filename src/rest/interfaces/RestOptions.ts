import { AuthLike } from '@discordoo/providers'
import { AllowedImageFormats, AllowedImageSizes } from '@src/utils'

/** Discord API options */
export interface ApiOptions {
  /**
   * API version
   * @default 10
   * */
  version?: number
  /**
   * API domain
   * @default discord.com
   * */
  domain?: string
  /**
   * API path
   * @default /api/v
   * */
  path?: string
  /**
   * API HTTP scheme
   * @default https
   * */
  scheme?: 'http' | 'https'
  /** Headers to attach in all requests */
  headers?: Record<string, any>
  /** Discord bot token */
  auth?: AuthLike
}

/** Discord API Rate Limits options */
export interface RateLimitsOptions {
  /** Whether built-in rate-limiter disabled or not */
  disable?: boolean
  /**
   * Global Rate Limit: max requests per second
   * @default 50
   * */
  globalLimit?: number
  /**
   * Invalid Request Limit: max invalid requests per 10 minutes
   * @default 10 000
   * */
  invalidLimit?: number
}

/** Discord CDN options */
export interface ContentDeliveryNetworkOptions {
  /**
   * Default format for all images
   * @default png
   * */
  defaultImgFormat?: AllowedImageFormats
  /**
   * Default size for all images
   * @default 128
   * */
  defaultImgSize?: AllowedImageSizes
  /**
   * CDN domain
   * @default cdn.discordapp.com
   * */
  domain?: string
}

/** Rest options */
export interface RestOptions {
  /** The maximum time in which the request should be executed */
  requestTimeout?: number
  /** User-Agent header that will be attached in all requests */
  userAgent?: string
  /** How many times retry the request before throw an error */
  retries?: number
  /** Discord CDN options */
  cdn?: ContentDeliveryNetworkOptions
  /** Discord API options */
  api?: ApiOptions
  /** Discord API Rate Limits options */
  limits?: RateLimitsOptions
}

export interface CompletedRestOptions {
  requestTimeout: number
  userAgent: string
  retries: number
  cdn: Required<ContentDeliveryNetworkOptions>
  api: Required<ApiOptions>
  limits: Required<RateLimitsOptions>
}
