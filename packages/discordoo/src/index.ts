/**
 * Discordoo
 * Brought to you by Mirdukkk and KislBall
 */

import createPreloadedClient from './createPreloadedClient'
import { CacheModule } from '@discordoo/cache'
import { Client as OriginalClient } from '@discordoo/core'

export * as Cache from '@discordoo/cache'
export * as Core from '@discordoo/core'
export * as Collection from '@discordoo/collection'
export * as WS from '@discordoo/ws'

const Client: typeof OriginalClient = createPreloadedClient(new CacheModule())

export { createPreloadedClient, Client }

