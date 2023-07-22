/** Emojis caching policy */
export enum EmojisCachingPolicy {
  /** Cache all emojis */
  All = 'all',
  /** Don't cache emojis */
  None = 'none',
  /** Cache animated emojis */
  Animated = 'animated',
  /** Cache static emojis (common) */
  Static = 'static',
  /** Cache guild emojis */
  Guild = 'guild',
  /** Cache reaction emojis */
  Reaction = 'reaction',
  /** Cache activity emojis */
  Activity = 'activity'
}
