import createPreloadedClient from './createPreloadedClient'
import { CacheModule } from '@discordoo/cache'

const Client = createPreloadedClient(new CacheModule())

export { createPreloadedClient, Client }