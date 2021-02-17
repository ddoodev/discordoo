import createPreloadedClient from './createPreloadedClient'
import CacheModule from '@discordoo/cache'

// TODO: add here default modules
export default createPreloadedClient(new CacheModule())

export { createPreloadedClient }