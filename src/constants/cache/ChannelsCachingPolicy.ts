/** Channels caching policy */
export enum ChannelsCachingPolicy {
  /** Cache all channels */
  ALL = 'all',
  /** Dont cache channels */
  NONE = 'none',
  /** Cache text channels */
  TEXT = 'text',
  /** Cache voice channels (does not includes stages) */
  VOICE = 'voice',
  /** Cache dm channels */
  DM = 'dm',
  /** Cache categories */
  CATEGORY = 'category',
  /** Cache news channels (does not includes threads) */
  NEWS = 'news',
  /** Cache 'store' channels (does not includes threads) */
  STORE = 'store',
  /** Cache news threads */
  NEWS_THREAD = 'newsThread',
  /** Cache public threads */
  PUBLIC_THREAD = 'publicThread',
  /** Cache private threads */
  PRIVATE_THREAD = 'privateThread',
  /** Cache stage voices */
  STAGE_VOICE = 'stageVoice',
}
