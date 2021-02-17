import { CacheModule as ICacheModule } from '@discordoo/client'

export default class CacheModule implements ICacheModule {
  isCore = true
  type: 'cache' | 'gateway' | 'rest' = 'cache'
  id = 'discordoo.modules.cache'
  private _caches: Map<string, any> = new Map<string, any>()

  constructor() { // TODO: add here cache policies

  }

  createCache<K>(type: string): K {
    throw new Error('Not implemented')
  }

  getCache<K>(type: string): K {
    throw new Error('Not implemented')
  }
}