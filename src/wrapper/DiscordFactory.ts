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
  static create<
    Stack extends DefaultDiscordApplicationStack = DefaultDiscordApplicationStack,
    Application extends DiscordApplication<Stack> = DiscordApplication<Stack>
  >(
    token: string,
    options?: ApplicationOptions & CreateApplicationOptions
  ): Application {
    if (!is<string>(token)) throw new ValidationError('DiscordFactory#create', 'Invalid token provided:', token)

    if (options?.useApp) return new options.useApp(token, options)
    return new DiscordApplication<Stack>(token, options) as Application
  }

  static createCache<
    Stack extends DefaultCacheApplicationStack = DefaultCacheApplicationStack,
    Application extends DiscordCacheApplication<Stack> = DiscordCacheApplication<Stack>
  >(
    token: string,
    options?: CacheApplicationOptions & CreateApplicationOptions
  ): Application {
    if (!is<string>(token)) throw new ValidationError('DiscordFactory#createCacheApplication', 'Invalid token provided:', token)

    if (options?.useApp) return new options.useApp(token, options)
    return new DiscordCacheApplication<Stack>(token, options) as Application
  }

  static createRest<
    Stack extends DefaultDiscordRestApplicationStack = DefaultDiscordRestApplicationStack,
    Application extends DiscordRestApplication<Stack> = DiscordRestApplication<Stack>
  >(
    token: string,
    options?: RestApplicationOptions & CreateApplicationOptions
  ): Application {
    if (!is<string>(token)) throw new ValidationError('DiscordFactory#createRestApplication', 'Invalid token provided:', token)

    if (options?.useApp) return new options.useApp(token, options)
    return new DiscordRestApplication<Stack>(token, options) as Application
  }

  static createWebhook<
    Stack extends DefaultWebhookApplicationStack = DefaultWebhookApplicationStack,
    Application extends WebhookApplication<Stack> = WebhookApplication<Stack>
  >(
    data: CreateWebhookApplicationData,
    options?: Omit<WebhookApplicationOptions, 'id' | 'token'> & CreateApplicationOptions
  ): Application {
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

    if (options?.useApp) return new options.useApp(data, options)
    return new WebhookApplication<Stack>({
      ...options,
      id,
      token
    }) as Application
  }
}
