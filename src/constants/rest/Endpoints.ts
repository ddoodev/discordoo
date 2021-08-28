export class Endpoints {
  static readonly CHANNEL
    =                          (channelID) => [ 'channels', channelID ]
  static readonly CHANNEL_BULK_DELETE
    =                          (channelID) => [ 'channels', channelID, 'messages', 'bulk-delete' ]
  static readonly CHANNEL_CALL_RING
    =                          (channelID) => [ 'channels', channelID, 'call', 'ring' ]
  static readonly CHANNEL_CROSSPOST
    =                   (channelID, msgID) => [ 'channels', channelID, 'messages', msgID, 'crosspost' ]
  static readonly CHANNEL_FOLLOW
    =                          (channelID) => [ 'channels', channelID, 'followers' ]
  static readonly CHANNEL_INVITES
    =                          (channelID) => [ 'channels', channelID, 'invites' ]
  static readonly CHANNEL_MESSAGE_REACTION
    =         (channelID, msgID, reaction) => [ 'channels', channelID, 'messages', msgID, 'reactions', reaction ]
  static readonly CHANNEL_MESSAGE_REACTION_USER
    = (channelID, msgID, reaction, userID) => [ 'channels', channelID, 'messages', msgID, 'reactions', reaction, userID ]
  static readonly CHANNEL_MESSAGE_REACTIONS
    =                   (channelID, msgID) => [ 'channels', channelID, 'messages', msgID, 'reactions' ]
  static readonly CHANNEL_MESSAGE
    =                   (channelID, msgID) => [ 'channels', channelID, 'messages', msgID ]
  static readonly CHANNEL_MESSAGES
    =                          (channelID) => [ 'channels', channelID, 'messages' ]
  static readonly CHANNEL_MESSAGES_SEARCH
    =                          (channelID) => [ 'channels', channelID, 'messages', 'search' ]
  static readonly CHANNEL_PERMISSION
    =                  (channelID, overID) => [ 'channels', channelID, 'permissions', overID ]
  static readonly CHANNEL_PERMISSIONS
    =                          (channelID) => [ 'channels', channelID, 'permissions' ]
  static readonly CHANNEL_PIN
    =                   (channelID, msgID) => [ 'channels', channelID, 'pins', msgID ]
  static readonly CHANNEL_PINS
    =                          (channelID) => [ 'channels', channelID, 'pins' ]
  static readonly CHANNEL_RECIPIENT
    =                    (groupID, userID) => [ 'channels', groupID, 'recipients', userID ]
  static readonly CHANNEL_TYPING
    =                          (channelID) => [ 'channels', channelID, 'typing' ]
  static readonly CHANNEL_WEBHOOKS
    =                          (channelID) => [ 'channels', channelID, 'webhooks' ]
  static readonly CHANNELS
    =                                   () => [ 'channels' ]
  static readonly CUSTOM_EMOJI_GUILD
    =                            (emojiID) => [ 'emojis', emojiID, 'guild' ]
  static readonly DISCOVERY_CATEGORIES
    =                                   () => [ 'discovery', 'categories' ]
  static readonly DISCOVERY_VALIDATION
    =                                   () => [ 'discovery', 'valid-term' ]
  static readonly GATEWAY
    =                                   () => [ 'gateway' ]
  static readonly GATEWAY_BOT
    =                                   () => [ 'gateway', 'bot' ]
  static readonly GUILD
    =                            (guildID) => [ 'guilds', guildID ]
  static readonly GUILD_AUDIT_LOGS
    =                            (guildID) => [ 'guilds', guildID, 'audit-logs' ]
  static readonly GUILD_BAN
    =                  (guildID, memberID) => [ 'guilds', guildID, 'bans', memberID ]
  static readonly GUILD_BANS
    =                            (guildID) => [ 'guilds', guildID, 'bans' ]
  static readonly GUILD_CHANNELS
    =                            (guildID) => [ 'guilds', guildID, 'channels' ]
  static readonly GUILD_DISCOVERY
    =                            (guildID) => [ 'guilds', guildID, 'discovery-metadata' ]
  static readonly GUILD_DISCOVERY_CATEGORY
    =                (guildID, categoryID) => [ 'guilds', guildID, 'discovery-categories', categoryID ]
  static readonly GUILD_EMBED
    =                            (guildID) => [ 'guilds', guildID, 'embed' ]
  static readonly GUILD_EMOJI
    =                   (guildID, emojiID) => [ 'guilds', guildID, 'emojis', emojiID ]
  static readonly GUILD_EMOJIS
    =                            (guildID) => [ 'guilds', guildID, 'emojis' ]
  static readonly GUILD_INTEGRATION
    =             (guildID, integrationID) => [ 'guilds', guildID, 'integrations', integrationID ]
  static readonly GUILD_INTEGRATION_SYNC
    =             (guildID, integrationID) => [ 'guilds', guildID, 'integrations', integrationID, 'sync' ]
  static readonly GUILD_INTEGRATIONS
    =                            (guildID) => [ 'guilds', guildID, 'integrations' ]
  static readonly GUILD_INVITES
    =                            (guildID) => [ 'guilds', guildID, 'invites' ]
  static readonly GUILD_VANITY_URL
    =                            (guildID) => [ 'guilds', guildID, 'vanity-url' ]
  static readonly GUILD_MEMBER
    =                  (guildID, memberID) => [ 'guilds', guildID, 'members', memberID ]
  static readonly GUILD_MEMBER_NICK
    =                  (guildID, memberID) => [ 'guilds', guildID, 'members', memberID, 'nick' ]
  static readonly GUILD_MEMBER_ROLE
    =          (guildID, memberID, roleID) => [ 'guilds', guildID, 'members', memberID, 'roles', roleID ]
  static readonly GUILD_MEMBERS
    =                            (guildID) => [ 'guilds', guildID, 'members' ]
  static readonly GUILD_MEMBERS_SEARCH
    =                            (guildID) => [ 'guilds', guildID, 'members', 'search' ]
  static readonly GUILD_MESSAGES_SEARCH
    =                            (guildID) => [ 'guilds', guildID, 'messages', 'search' ]
  static readonly GUILD_PREVIEW
    =                            (guildID) => [ 'guilds', guildID, 'preview' ]
  static readonly GUILD_PRUNE
    =                            (guildID) => [ 'guilds', guildID, 'prune' ]
  static readonly GUILD_ROLE
    =                    (guildID, roleID) => [ 'guilds', guildID, 'roles', roleID ]
  static readonly GUILD_ROLES
    =                            (guildID) => [ 'guilds', guildID, 'roles' ]
  static readonly GUILD_TEMPLATE
    =                               (code) => [ 'guilds', 'templates', code ]
  static readonly GUILD_TEMPLATES
    =                            (guildID) => [ 'guilds', guildID, 'templates' ]
  static readonly GUILD_TEMPLATE_GUILD
    =                      (guildID, code) => [ 'guilds', guildID, 'templates', code ]
  static readonly GUILD_VOICE_REGIONS
    =                            (guildID) => [ 'guilds', guildID, 'regions' ]
  static readonly GUILD_WEBHOOKS
    =                            (guildID) => [ 'guilds', guildID, 'webhooks' ]
  static readonly GUILD_WELCOME_SCREEN
    =                            (guildID) => [ 'guilds', guildID, 'welcome-screen' ]
  static readonly GUILD_WIDGET_SETTINGS
    =                            (guildID) => [ 'guilds', guildID, 'widget' ]
  static readonly GUILD_WIDGET
    =                            (guildID) => [ 'guilds', guildID, 'widget.json' ]
  static readonly GUILD_VOICE_STATE
    =                      (guildID, user) => [ 'guilds', guildID, 'voice-states', user ]
  static readonly GUILDS
    =                                   () => [ 'guilds' ]
  static readonly INVITE
    =                           (inviteID) => [ 'invites', inviteID ]
  static readonly OAUTH2_APPLICATION
    =                              (appID) => [ 'oauth2', 'applications', appID ]
  static readonly STAGE_INSTANCE
    =                          (channelID) => [ 'stage-instances', channelID ]
  static readonly STAGE_INSTANCES
    =                                   () => [ 'stage-instances' ]
  static readonly CHANNEL_THREAD_MEMBER
    =                (channelID, memberID) => [ 'channels', channelID, 'thread-members', memberID ]
  static readonly CHANNEL_THREAD_WITH_MESSAGE
    =               (channelID, messageID) => [ 'channels', channelID, 'messages', messageID, 'threads' ]
  static readonly CHANNEL_THREAD_WITHOUT_MESSAGE
    =                          (channelID) => [ 'channels', channelID, 'threads' ]
  static readonly CHANNEL_THREADS_ACTIVE
    =                          (channelID) => [ 'channels', channelID, 'threads', 'active' ]
  static readonly CHANNEL_THREADS_ARCHIVED
    =                    (channelID, type) => [ 'channels', channelID, 'threads', 'archived', type ]
  static readonly CHANNEL_THREADS_ARCHIVED_JOINED
    =                          (channelID) => [ 'channels', channelID, 'users', '@me', 'threads', 'archived', 'private' ]
  static readonly GUILD_THREADS_ACTIVE
    =                            (guildID) => [ 'guilds', guildID, 'threads', 'active' ]
  static readonly USER
    =                             (userID) => [ 'users', userID ]
  static readonly USER_BILLING
    =                             (userID) => [ 'users', userID, 'billing' ]
  static readonly USER_BILLING_PAYMENTS
    =                             (userID) => [ 'users', userID, 'billing', 'payments' ]
  static readonly USER_BILLING_PREMIUM_SUBSCRIPTION
    =                             (userID) => [ 'users', userID, 'billing', 'premium-subscription' ]
  static readonly USER_CHANNELS
    =                             (userID) => [ 'users', userID, 'channels' ]
  static readonly USER_CONNECTIONS
    =                             (userID) => [ 'users', userID, 'connections' ]
  static readonly USER_CONNECTION_PLATFORM
    =               (userID, platform, id) => [ 'users', userID, 'connections', platform, id ]
  static readonly USER_GUILD
    =                    (userID, guildID) => [ 'users', userID, 'guilds', guildID ]
  static readonly USER_GUILDS
    =                             (userID) => [ 'users', userID, 'guilds' ]
  static readonly USER_MFA_CODES
    =                             (userID) => [ 'users', userID, 'mfa', 'codes' ]
  static readonly USER_MFA_TOTP_DISABLE
    =                             (userID) => [ 'users', userID, 'mfa', 'totp', 'disable' ]
  static readonly USER_MFA_TOTP_ENABLE
    =                             (userID) => [ 'users', userID, 'mfa', 'totp', 'enable' ]
  static readonly USER_NOTE
    =                   (userID, targetID) => [ 'users', userID, 'note', targetID ]
  static readonly USER_PROFILE
    =                             (userID) => [ 'users', userID, 'profile' ]
  static readonly USER_RELATIONSHIP
    =                      (userID, relID) => [ 'users', userID, 'relationships', relID ]
  static readonly USER_SETTINGS
    =                             (userID) => [ 'users', userID, 'settings' ]
  static readonly USERS
    =                                   () => [ 'users' ]
  static readonly VOICE_REGIONS
    =                                   () => [ 'voice', 'regions' ]
  static readonly WEBHOOK
    =                             (hookID) => [ 'webhooks', hookID ]
  static readonly WEBHOOK_MESSAGE
    =               (hookID, token, msgID) => [ 'webhooks', hookID, token, 'messages', msgID ]
  static readonly WEBHOOK_SLACK
    =                             (hookID) => [ 'webhooks', hookID, 'slack' ]
  static readonly WEBHOOK_TOKEN
    =                      (hookID, token) => [ 'webhooks', hookID, token ]
  static readonly WEBHOOK_TOKEN_SLACK
    =                      (hookID, token) => [ 'webhooks', hookID, token, 'slack' ]

  // CDN Endpoints
  static readonly ACHIEVEMENT_ICON
    = (applicationID, achievementID, icon) => [ 'app-assets', applicationID, 'achievements', achievementID, 'icons', icon ]
  static readonly APPLICATION_ASSET
    =               (applicationID, asset) => [ 'app-assets', applicationID, asset ]
  static readonly APPLICATION_ICON
    =                (applicationID, icon) => [ 'app-icons', applicationID, icon ]
  static readonly CHANNEL_ICON
    =             (channelID, channelIcon) => [ 'channel-icons', channelID, channelIcon ]
  static readonly CUSTOM_EMOJI
    =                            (emojiID) => [ 'emojis', emojiID ]
  static readonly DEFAULT_USER_AVATAR
    =                  (userDiscriminator) => [ 'embed', 'avatars', userDiscriminator ]
  static readonly GUILD_BANNER
    =               (guildID, guildBanner) => [ 'banners', guildID, guildBanner ]
  static readonly GUILD_DISCOVERY_SPLASH
    =      (guildID, guildDiscoverySplash) => [ 'discovery-splashes', guildID, guildDiscoverySplash ]
  static readonly GUILD_ICON
    =                 (guildID, guildIcon) => [ 'icons', guildID, guildIcon ]
  static readonly GUILD_SPLASH
    =               (guildID, guildSplash) => [ 'splashes', guildID, guildSplash ]
  static readonly TEAM_ICON
    =                   (teamID, teamIcon) => [ 'team-icons', teamID, teamIcon ]
  static readonly USER_AVATAR
    =                 (userID, userAvatar) => [ 'avatars', userID, userAvatar ]
}
