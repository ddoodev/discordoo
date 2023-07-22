/** Reactions caching policy */
export enum ReactionsCachingPolicy {
  /** Cache all reactions */
  All = 'all',
  /** Don't cache reactions */
  None = 'none',
  /** Cache only app own reactions */
  Own = 'own',
}
