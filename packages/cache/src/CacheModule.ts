import { CacheCell, CacheModule as ICacheModule } from '@discordoo/core'
import CollectionCacheCell from './CollectionCacheCell'
import Collection from '@discordoo/collection'

export default class CacheModule implements ICacheModule {
  isCore = true
  type: 'cache' | 'gateway' | 'rest' = 'cache'
  id = 'discordoo.modules.cache'
  private _caches: Collection<string, CollectionCacheCell<any, any>> = new Collection<string, CollectionCacheCell<any, any>>()

  constructor() { // TODO: add here cache policies

  }

  createCache<K extends CacheCell<any, any>>(type: string): K {
    this._caches.set(type, new CollectionCacheCell<any, any>() as unknown as K)
    return this._caches.get(type) as unknown as K
  }

  getCache<K>(type: string): K | undefined {
    return this._caches.get(type) as unknown as K
  }
}