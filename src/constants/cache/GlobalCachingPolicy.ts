/** Global caching policy used to override any other caching policies */
export enum GlobalCachingPolicy {
  /** Cache everything we can */
  All = 'all',
  /** Cache absolutely nothing */
  None = 'none',
}
