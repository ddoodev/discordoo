import CacheNamespace from './CacheNamespace'

/** Represents a CacheProvider. Bound to Client context */
type CacheProvider<T> = () => T & CacheNamespace<any, any> | Promise<T & CacheNamespace<any, any>>

export default CacheProvider
