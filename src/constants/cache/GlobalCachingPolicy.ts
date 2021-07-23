/** Global caching policy used to override any other caching policies */
export enum GlobalCachingPolicy {
  /** Cache everything we can */
  ALL = 'all',
  /** Cache absolutely nothing */
  NONE = 'none',
}
