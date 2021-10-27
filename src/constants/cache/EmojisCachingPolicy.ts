/** Emojis caching policy */
export enum EmojisCachingPolicy {
  /** Cache all emojis */
  ALL = 'all',
  /** Don't cache emojis */
  NONE = 'none',
  /** Cache animated emojis */
  ANIMATED = 'animated',
  /** Cache static emojis (common) */
  STATIC = 'static',
}
