/** Presences caching policy */
export enum PresencesCachingPolicy {
  /** Cache all presences */
  ALL = 'all',
  /** Don't cache presences */
  NONE = 'none',
  /** Cache presences with online status */
  ONLINE = 'online',
  /** Cache presences with dnd status */
  DND = 'dnd',
  /** Cache presences with idle status */
  IDLE = 'idle',
  /** Cache presences with offline status */
  OFFLINE = 'offline',
}
