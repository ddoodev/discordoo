export enum StickersCachingPolicy {
    /** Cache all stickers */
    All = "all",
    /** Don't cache stickers */
    None = "none",
    /** Cache standard (global) stickers */
    Standard = "standard",
    /** Cache guild stickers */
    Guild = "guild",
    /** Cache stickers with 'png' format type */
    Png = "png",
    /** Cache stickers with 'apng' format type */
    Apng = "apng",
    /** Cache stickers with 'lottie' format type */
    Lottie = "lottie"
}
