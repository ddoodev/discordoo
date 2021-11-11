/** Members caching policy */
export enum GuildMembersCachingPolicy {
  /** Cache all members */
  ALL = 'all',
  /** Don't cache members */
  NONE = 'none',
  /** Cache online members */
  ONLINE = 'online',
  /** Cache members with dnd status */
  DND = 'dnd',
  /** Cache members with idle status */
  IDLE = 'idle',
  /** Cache offline members */
  OFFLINE = 'offline',
  /** Cache guilds owners */
  OWNER = 'owner',
  /** Cache members which are pending due to discord's welcome screen */
  PENDING = 'pending',
  /** Cache connected to voice channels members */
  VOICE = 'voice',
  /** Cache members who recently send a message */
  RECENT_MESSAGE = 'recentMessage',
}
