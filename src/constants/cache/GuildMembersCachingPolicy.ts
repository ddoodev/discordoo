/** Members caching policy */
export enum GuildMembersCachingPolicy {
  /** Cache all members */
  All = 'all',
  /** Don't cache members */
  None = 'none',
  /** Cache online members */
  Online = 'online',
  /** Cache members with dnd status */
  Dnd = 'dnd',
  /** Cache members with idle status */
  Idle = 'idle',
  /** Cache offline members */
  Offline = 'offline',
  /** Cache guilds owners */
  Owner = 'owner',
  /** Cache members which are pending due to discord's welcome screen */
  Pending = 'pending',
  /** Cache connected to voice channels members */
  Voice = 'voice',
  /** Cache members who recently send a message */
  RecentMessage = 'recentMessage',
}
