import { Client as OriginalClient, ClientConfig } from '@discordoo/core'
import { CacheModule } from '@discordoo/cache'

export class Client extends OriginalClient {
  constructor(config: ClientConfig) {
    super(config)

    this.moduleLoader.use(new CacheModule())
  }
}
