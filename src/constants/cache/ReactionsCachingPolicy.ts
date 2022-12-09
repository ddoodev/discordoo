/** Reactions caching policy */
export enum ReactionsCachingPolicy {
  /** Cache all reactions */
  All = 'all',
  /** Don't cache reactions */
  None = 'none',
  /** Cache only client own reactions */
  Own = 'own',
}
