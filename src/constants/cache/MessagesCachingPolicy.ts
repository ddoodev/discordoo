/** Messages caching policy */
export enum MessagesCachingPolicy {
  /** Cache all messages */
  ALL = 'all',
  /** Dont cache messages */
  NONE = 'none',
  /** Cache messages from users */
  USERS = 'users',
  /** Cache messages from bots */
  BOTS = 'bots',
}
