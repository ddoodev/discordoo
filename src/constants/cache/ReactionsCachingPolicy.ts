/** Reactions caching policy */
export enum ReactionsCachingPolicy {
  /** Cache all reactions */
  ALL = 'all',
  /** Don't cache reactions */
  NONE = 'none',
  /** Cache only client own reactions */
  OWN = 'own',
}
