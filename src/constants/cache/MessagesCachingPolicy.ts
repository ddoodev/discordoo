export enum MessagesCachingPolicy {
    /** Cache all messages */
    All = "all",
    /** Don't cache messages */
    None = "none",
    /** Cache messages from users */
    Users = "users",
    /** Cache messages from bots */
    Bots = "bots"
}
