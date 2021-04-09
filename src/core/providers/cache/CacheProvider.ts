import CacheNamespace from './CacheNamespace'

/** Represents a CacheProvider. Bound to Client context */
type CacheProvider<T extends CacheNamespace> = (namespace: string) => T | Promise<T>

export default CacheProvider
