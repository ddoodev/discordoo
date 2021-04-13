import ClientBuilder from '@src/wrapper/ClientBuilder'
import ModuleHostModule from '@src/wrapper/ModuleHostModule'
import { DefaultClientStack } from '@src/core'

export default function createBot<Stack extends DefaultClientStack>(token: string, root: ModuleHostModule) {
  return new ClientBuilder<Stack>(token, root)
}