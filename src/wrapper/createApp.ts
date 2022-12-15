import { ApplicationBuilder } from '@src/wrapper/ApplicationBuilder'
import { DefaultApplicationStack } from '@src/core'
import { CreateAppOptions } from '@src/wrapper/interfaces/CreateAppOptions'

export function createApp<Stack extends DefaultApplicationStack = DefaultApplicationStack>(token: string, options?: CreateAppOptions) {
  return new ApplicationBuilder<Stack>(token, options)
}
