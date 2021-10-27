/** Messages caching policy */
export enum MessagesCachingPolicy { // TODO: message types
  /** Cache all messages */
  ALL = 'all',
  /** Don't cache messages */
  NONE = 'none',
  /** Cache messages from users */
  USERS = 'users',
  /** Cache messages from bots */
  BOTS = 'bots',
}
