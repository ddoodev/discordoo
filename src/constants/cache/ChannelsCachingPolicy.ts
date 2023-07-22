export enum ChannelsCachingPolicy {
    /** Cache all channels */
    All = "all",
    /** Don't cache channels */
    None = "none",
    /** Cache text channels */
    Text = "text",
    /** Cache voice channels (does not includes stages) */
    Voice = "voice",
    /** Cache dm channels */
    Dm = "dm",
    /** Cache categories */
    Category = "category",
    /** Cache news channels (does not includes threads) */
    News = "news",
    /** Cache 'store' channels */
    Store = "store",
    /** Cache news threads */
    NewsThread = "newsThread",
    /** Cache public threads */
    PublicThread = "publicThread",
    /** Cache private threads */
    PrivateThread = "privateThread",
    /** Cache stage voices */
    StageVoice = "stageVoice"
}
