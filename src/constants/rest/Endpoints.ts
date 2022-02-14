// based on https://github.com/abalabahaha/eris/blob/fba1f7c6621575778c26a378b4d313febe894a42/lib/rest/Endpoints.js (MIT license)
export class Endpoints {
  static readonly CHANNEL
    =                          (channelId) => [ 'channels', channelId ]
  static readonly CHANNEL_BULK_DELETE
    =                          (channelId) => [ 'channels', channelId, 'messages', 'bulk-delete' ]
  static readonly CHANNEL_CALL_RING
    =                          (channelId) => [ 'channels', channelId, 'call', 'ring' ]
  static readonly CHANNEL_CROSSPOST
    =                   (channelId, msgId) => [ 'channels', channelId, 'messages', msgId, 'crosspost' ]
  static readonly CHANNEL_FOLLOW
    =                          (channelId) => [ 'channels', channelId, 'followers' ]
  static readonly CHANNEL_INVITES
    =                          (channelId) => [ 'channels', channelId, 'invites' ]
  static readonly CHANNEL_MESSAGE_REACTION
    =         (channelId, msgId, reaction) => [ 'channels', channelId, 'messages', msgId, 'reactions', reaction ]
  static readonly CHANNEL_MESSAGE_REACTION_USER
    = (channelId, msgId, reaction, userId) => [ 'channels', channelId, 'messages', msgId, 'reactions', reaction, userId ]
  static readonly CHANNEL_MESSAGE_REACTIONS
    =                   (channelId, msgId) => [ 'channels', channelId, 'messages', msgId, 'reactions' ]
  static readonly CHANNEL_MESSAGE
    =                   (channelId, msgId) => [ 'channels', channelId, 'messages', msgId ]
  static readonly CHANNEL_MESSAGES
    =                          (channelId) => [ 'channels', channelId, 'messages' ]
  static readonly CHANNEL_MESSAGES_SEARCH
    =                          (channelId) => [ 'channels', channelId, 'messages', 'search' ]
  static readonly CHANNEL_PERMISSION
    =                  (channelId, overId) => [ 'channels', channelId, 'permissions', overId ]
  static readonly CHANNEL_PERMISSIONS
    =                          (channelId) => [ 'channels', channelId, 'permissions' ]
  static readonly CHANNEL_PIN
    =                   (channelId, msgId) => [ 'channels', channelId, 'pins', msgId ]
  static readonly CHANNEL_PINS
    =                          (channelId) => [ 'channels', channelId, 'pins' ]
  static readonly CHANNEL_RECIPIENT
    =                    (groupId, userId) => [ 'channels', groupId, 'recipients', userId ]
  static readonly CHANNEL_TYPING
    =                          (channelId) => [ 'channels', channelId, 'typing' ]
  static readonly CHANNEL_WEBHOOKS
    =                          (channelId) => [ 'channels', channelId, 'webhooks' ]
  static readonly CHANNELS
    =                                   () => [ 'channels' ]
  static readonly CUSTOM_EMOJI_GUILD
    =                            (emojiId) => [ 'emojis', emojiId, 'guild' ]
  static readonly DISCOVERY_CATEGORIES
    =                                   () => [ 'discovery', 'categories' ]
  static readonly DISCOVERY_VALIDATION
    =                                   () => [ 'discovery', 'valid-term' ]
  static readonly GATEWAY
    =                                   () => [ 'gateway' ]
  static readonly GATEWAY_BOT
    =                                   () => [ 'gateway', 'bot' ]
  static readonly GUILD
    =                            (guildId) => [ 'guilds', guildId ]
  static readonly GUILD_AUDIT_LOGS
    =                            (guildId) => [ 'guilds', guildId, 'audit-logs' ]
  static readonly GUILD_BAN
    =                  (guildId, memberId) => [ 'guilds', guildId, 'bans', memberId ]
  static readonly GUILD_BANS
    =                            (guildId) => [ 'guilds', guildId, 'bans' ]
  static readonly GUILD_CHANNELS
    =                            (guildId) => [ 'guilds', guildId, 'channels' ]
  static readonly GUILD_DISCOVERY
    =                            (guildId) => [ 'guilds', guildId, 'discovery-metadata' ]
  static readonly GUILD_DISCOVERY_CATEGORY
    =                (guildId, categoryId) => [ 'guilds', guildId, 'discovery-categories', categoryId ]
  static readonly GUILD_EMBED
    =                            (guildId) => [ 'guilds', guildId, 'embed' ]
  static readonly GUILD_EMOJI
    =                   (guildId, emojiId) => [ 'guilds', guildId, 'emojis', emojiId ]
  static readonly GUILD_EMOJIS
    =                            (guildId) => [ 'guilds', guildId, 'emojis' ]
  static readonly GUILD_INTEGRATION
    =             (guildId, integrationId) => [ 'guilds', guildId, 'integrations', integrationId ]
  static readonly GUILD_INTEGRATION_SYNC
    =             (guildId, integrationId) => [ 'guilds', guildId, 'integrations', integrationId, 'sync' ]
  static readonly GUILD_INTEGRATIONS
    =                            (guildId) => [ 'guilds', guildId, 'integrations' ]
  static readonly GUILD_INVITES
    =                            (guildId) => [ 'guilds', guildId, 'invites' ]
  static readonly GUILD_VANITY_URL
    =                            (guildId) => [ 'guilds', guildId, 'vanity-url' ]
  static readonly GUILD_MEMBER
    =                  (guildId, memberId) => [ 'guilds', guildId, 'members', memberId ]
  static readonly GUILD_MEMBER_NICK
    =                  (guildId, memberId) => [ 'guilds', guildId, 'members', memberId, 'nick' ]
  static readonly GUILD_MEMBER_ROLE
    =          (guildId, memberId, roleId) => [ 'guilds', guildId, 'members', memberId, 'roles', roleId ]
  static readonly GUILD_MEMBERS
    =                            (guildId) => [ 'guilds', guildId, 'members' ]
  static readonly GUILD_MEMBERS_SEARCH
    =                            (guildId) => [ 'guilds', guildId, 'members', 'search' ]
  static readonly GUILD_MESSAGES_SEARCH
    =                            (guildId) => [ 'guilds', guildId, 'messages', 'search' ]
  static readonly GUILD_PREVIEW
    =                            (guildId) => [ 'guilds', guildId, 'preview' ]
  static readonly GUILD_PRUNE
    =                            (guildId) => [ 'guilds', guildId, 'prune' ]
  static readonly GUILD_ROLE
    =                    (guildId, roleId) => [ 'guilds', guildId, 'roles', roleId ]
  static readonly GUILD_ROLES
    =                            (guildId) => [ 'guilds', guildId, 'roles' ]
  static readonly GUILD_TEMPLATE
    =                               (code) => [ 'guilds', 'templates', code ]
  static readonly GUILD_TEMPLATES
    =                            (guildId) => [ 'guilds', guildId, 'templates' ]
  static readonly GUILD_TEMPLATE_GUILD
    =                      (guildId, code) => [ 'guilds', guildId, 'templates', code ]
  static readonly GUILD_VOICE_REGIONS
    =                            (guildId) => [ 'guilds', guildId, 'regions' ]
  static readonly GUILD_WEBHOOKS
    =                            (guildId) => [ 'guilds', guildId, 'webhooks' ]
  static readonly GUILD_WELCOME_SCREEN
    =                            (guildId) => [ 'guilds', guildId, 'welcome-screen' ]
  static readonly GUILD_WIDGET_SETTINGS
    =                            (guildId) => [ 'guilds', guildId, 'widget' ]
  static readonly GUILD_WIDGET
    =                            (guildId) => [ 'guilds', guildId, 'widget.json' ]
  static readonly GUILD_VOICE_STATE
    =                      (guildId, user) => [ 'guilds', guildId, 'voice-states', user ]
  static readonly GUILDS
    =                                   () => [ 'guilds' ]
  static readonly INVITE
    =                           (inviteId) => [ 'invites', inviteId ]
  static readonly OAUTH2_APPLICATION
    =                              (appId) => [ 'oauth2', 'applications', appId ]
  static readonly STAGE_INSTANCE
    =                          (channelId) => [ 'stage-instances', channelId ]
  static readonly STAGE_INSTANCES
    =                                   () => [ 'stage-instances' ]
  static readonly STICKER
    =                          (stickerId) => [ 'stickers', stickerId ]
  static readonly NITRO_STICKERS
    =                                   () => [ 'sticker-packs' ]
  static readonly GUILD_STICKER
    =                 (guildId, stickerId) => [ 'guilds', guildId, 'stickers', stickerId ]
  static readonly GUILD_STICKERS
    =                            (guildId) => [ 'guilds', guildId, 'stickers' ]
  static readonly CHANNEL_THREAD_MEMBER
    =                (channelId, memberId) => [ 'channels', channelId, 'thread-members', memberId ]
  static readonly CHANNEL_MESSAGE_THREADS
    =               (channelId, messageId) => [ 'channels', channelId, 'messages', messageId, 'threads' ]
  static readonly CHANNEL_THREADS
    =                          (channelId) => [ 'channels', channelId, 'threads' ]
  static readonly CHANNEL_ARCHIVE_THREADS
    =                    (channelId, type) => [ 'channels', channelId, 'threads', 'archived', type ]
  static readonly CHANNEL_ARCHIVED_JOINED_THREADS
    =                          (channelId) => [ 'channels', channelId, 'users', '@me', 'threads', 'archived', 'private' ]
  static readonly GUILD_ACTIVE_THREADS
    =                            (guildId) => [ 'guilds', guildId, 'threads', 'active' ]
  static readonly USER
    =                             (userId) => [ 'users', userId ]
  static readonly USER_BILLING
    =                             (userId) => [ 'users', userId, 'billing' ]
  static readonly USER_BILLING_PAYMENTS
    =                             (userId) => [ 'users', userId, 'billing', 'payments' ]
  static readonly USER_BILLING_PREMIUM_SUBSCRIPTION
    =                             (userId) => [ 'users', userId, 'billing', 'premium-subscription' ]
  static readonly USER_CHANNELS
    =                             (userId) => [ 'users', userId, 'channels' ]
  static readonly USER_CONNECTIONS
    =                             (userId) => [ 'users', userId, 'connections' ]
  static readonly USER_CONNECTION_PLATFORM
    =               (userId, platform, id) => [ 'users', userId, 'connections', platform, id ]
  static readonly USER_GUILD
    =                    (userId, guildId) => [ 'users', userId, 'guilds', guildId ]
  static readonly USER_GUILDS
    =                             (userId) => [ 'users', userId, 'guilds' ]
  static readonly USER_MFA_CODES
    =                             (userId) => [ 'users', userId, 'mfa', 'codes' ]
  static readonly USER_MFA_TOTP_DISABLE
    =                             (userId) => [ 'users', userId, 'mfa', 'totp', 'disable' ]
  static readonly USER_MFA_TOTP_ENABLE
    =                             (userId) => [ 'users', userId, 'mfa', 'totp', 'enable' ]
  static readonly USER_NOTE
    =                   (userId, targetId) => [ 'users', userId, 'note', targetId ]
  static readonly USER_PROFILE
    =                             (userId) => [ 'users', userId, 'profile' ]
  static readonly USER_RELATIONSHIP
    =                      (userId, relId) => [ 'users', userId, 'relationships', relId ]
  static readonly USER_SETTINGS
    =                             (userId) => [ 'users', userId, 'settings' ]
  static readonly USERS
    =                                   () => [ 'users' ]
  static readonly VOICE_REGIONS
    =                                   () => [ 'voice', 'regions' ]
  static readonly WEBHOOK
    =                             (hookId) => [ 'webhooks', hookId ]
  static readonly WEBHOOK_MESSAGE
    =               (hookId, token, msgId) => [ 'webhooks', hookId, token, 'messages', msgId ]
  static readonly WEBHOOK_SLACK
    =                             (hookId) => [ 'webhooks', hookId, 'slack' ]
  static readonly WEBHOOK_TOKEN
    =                      (hookId, token) => [ 'webhooks', hookId, token ]
  static readonly WEBHOOK_TOKEN_SLACK
    =                      (hookId, token) => [ 'webhooks', hookId, token, 'slack' ]

  // CDN Endpoints
  static readonly ACHIEVEMENT_ICON
    = (applicationId, achievementId, icon) => [ 'app-assets', applicationId, 'achievements', achievementId, 'icons', icon ]
  static readonly APPLICATION_ASSET
    =               (applicationId, asset) => [ 'app-assets', applicationId, asset ]
  static readonly APPLICATION_ICON
    =                (applicationId, icon) => [ 'app-icons', applicationId, icon ]
  static readonly CHANNEL_ICON
    =             (channelId, channelIcon) => [ 'channel-icons', channelId, channelIcon ]
  static readonly CUSTOM_EMOJI
    =                            (emojiId) => [ 'emojis', emojiId ]
  static readonly DEFAULT_USER_AVATAR
    =                  (userDiscriminator) => [ 'embed', 'avatars', userDiscriminator ]
  static readonly GUILD_BANNER
    =               (guildId, guildBanner) => [ 'banners', guildId, guildBanner ]
  static readonly GUILD_DISCOVERY_SPLASH
    =      (guildId, guildDiscoverySplash) => [ 'discovery-splashes', guildId, guildDiscoverySplash ]
  static readonly GUILD_ICON
    =                 (guildId, guildIcon) => [ 'icons', guildId, guildIcon ]
  static readonly GUILD_SPLASH
    =               (guildId, guildSplash) => [ 'splashes', guildId, guildSplash ]
  static readonly TEAM_ICON
    =                   (teamId, teamIcon) => [ 'team-icons', teamId, teamIcon ]
  static readonly USER_AVATAR
    =                 (userId, userAvatar) => [ 'avatars', userId, userAvatar ]
}
