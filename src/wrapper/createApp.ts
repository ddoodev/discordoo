import { ClientBuilder } from '@src/wrapper/ClientBuilder'
import { DefaultClientStack } from '@src/core'
import { CreateAppOptions } from '@src/wrapper/interfaces/CreateAppOptions'

export function createApp<Stack extends DefaultClientStack = DefaultClientStack>(token: string, options?: CreateAppOptions) {
  return new ClientBuilder<Stack>(token, options)
}
