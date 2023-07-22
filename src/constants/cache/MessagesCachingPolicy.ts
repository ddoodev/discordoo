/** Messages caching policy */
export enum MessagesCachingPolicy { // TODO: message types
  /** Cache all messages */
  All = 'all',
  /** Don't cache messages */
  None = 'none',
  /** Cache messages from users */
  Users = 'users',
  /** Cache messages from bots */
  Bots = 'bots',
}
