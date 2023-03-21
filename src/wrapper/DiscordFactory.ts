import {
  CacheApplicationOptions,
  DefaultCacheApplicationStack,
  DefaultDiscordApplicationStack,
  DefaultDiscordRestApplicationStack, DefaultWebhookApplicationStack,
  DiscordApplication, DiscordCacheApplication, DiscordRestApplication,
  WebhookApplication, RestApplicationOptions, ApplicationOptions, WebhookApplicationOptions
} from '@src/core'
import { CreateApplicationOptions, CreateWebhookApplicationData } from '@src/wrapper/interfaces'
import { is } from 'typescript-is'
import { ValidationError } from '@src/utils'

export class DiscordFactory {
  static create<Stack extends DefaultDiscordApplicationStack = DefaultDiscordApplicationStack>(
    token: string,
    options?: ApplicationOptions & CreateApplicationOptions
  ): DiscordApplication<Stack> {
    if (!is<string>(token)) throw new ValidationError('DiscordFactory#create', 'Invalid token provided:', token)

    if (options?.useApp) return new options.useApp(token, options)
    return new DiscordApplication<Stack>(token, options)
  }

  static createCacheApplication<Stack extends DefaultCacheApplicationStack = DefaultCacheApplicationStack>(
    token: string,
    options?: CacheApplicationOptions & CreateApplicationOptions
  ) {
    if (!is<string>(token)) throw new ValidationError('DiscordFactory#createCacheApplication', 'Invalid token provided:', token)

    if (options?.useApp) return new options.useApp(token, options)
    return new DiscordCacheApplication<Stack>(token, options)
  }

  static createRestApplication<Stack extends DefaultDiscordRestApplicationStack = DefaultDiscordRestApplicationStack>(
    token: string,
    options?: RestApplicationOptions & CreateApplicationOptions
  ) {
    if (!is<string>(token)) throw new ValidationError('DiscordFactory#createRestApplication', 'Invalid token provided:', token)

    if (options?.useApp) return new options.useApp(token, options)
    return new DiscordRestApplication<Stack>(token, options)
  }

  static createWebhookApplication<Stack extends DefaultWebhookApplicationStack = DefaultWebhookApplicationStack>(
    data: CreateWebhookApplicationData,
    options: Omit<WebhookApplicationOptions, 'id' | 'token'> & CreateApplicationOptions
  ) {
    let { id, token } = data
    if (!id || !token) {
      if (!data.url) throw new ValidationError(
        'DiscordFactory#createWebhookApplication',
        'Invalid webhook data provided. You should specify either id and token or url. Specified:',
        data
      )
      const url = new URL(data.url)
      const path = url.pathname.split('/')
      id = path[3]
      token = path[4]
    }

    if (!is<string>(id)) throw new ValidationError('DiscordFactory#createWebhookApplication', 'Invalid id provided:', id)
    if (!is<string>(token)) throw new ValidationError('DiscordFactory#createWebhookApplication', 'Invalid token provided:', token)

    if (options?.useApp) return new options.useApp(options)
    return new WebhookApplication<Stack>({
      ...options,
      id,
      token
    })
  }
}