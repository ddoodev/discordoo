import createPreloadedClient from './createPreloadedClient'
import { CacheModule } from '@discordoo/cache'

export * as Cache from '@discordoo/cache'
export * as Core from '@discordoo/core'
export * as Collection from '@discordoo/collection'
export * as WS from '@discordoo/ws'

const Client = createPreloadedClient(new CacheModule())

export { createPreloadedClient, Client }

