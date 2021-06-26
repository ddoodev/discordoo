import { ClientBuilder } from '@src/wrapper/ClientBuilder'
import { DefaultClientStack } from '@src/core'
import { ClientOptions } from '@src/core/client/ClientOptions'

export function createApp<Stack extends DefaultClientStack = DefaultClientStack>(token: string, options?: ClientOptions) {
  return new ClientBuilder<Stack>(token, options)
}
