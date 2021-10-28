/** Stickers caching policy */
export enum StickersCachingPolicy {
  /** Cache all stickers */
  ALL = 'all',
  /** Don't cache stickers */
  NONE = 'none',
  /** Cache standard (global) stickers */
  STANDARD = 'standard',
  /** Cache guild stickers */
  GUILD = 'guild',
  /** Cache stickers with 'png' format type */
  PNG = 'png',
  /** Cache stickers with 'apng' format type */
  APNG = 'apng',
  /** Cache stickers with 'lottie' format type */
  LOTTIE = 'lottie',
}
