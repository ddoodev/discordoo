/** Presences caching policy */
export enum PresencesCachingPolicy {
  /** Cache all presences */
  All = 'all',
  /** Don't cache presences */
  None = 'none',
  /** Cache presences with online status */
  Online = 'online',
  /** Cache presences with dnd status */
  Dnd = 'dnd',
  /** Cache presences with idle status */
  Idle = 'idle',
  /** Cache presences with offline status */
  Offline = 'offline',
}
