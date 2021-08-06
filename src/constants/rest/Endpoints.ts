/*
The MIT License (MIT)

Copyright (c) 2016-2021 abalabahaha

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

--
http://github.com/abalabahaha/eris
*/

export class Endpoints {
  static CHANNEL
    =                          (channelID) => [ 'channels', channelID ]
  static CHANNEL_BULK_DELETE
    =                          (channelID) => [ 'channels', channelID, 'messages', 'bulk-delete' ]
  static CHANNEL_CALL_RING
    =                          (channelID) => [ 'channels', channelID, 'call', 'ring' ]
  static CHANNEL_CROSSPOST
    =                   (channelID, msgID) => [ 'channels', channelID, 'messages', msgID, 'crosspost' ]
  static CHANNEL_FOLLOW
    =                          (channelID) => [ 'channels', channelID, 'followers' ]
  static CHANNEL_INVITES
    =                          (channelID) => [ 'channels', channelID, 'invites' ]
  static CHANNEL_MESSAGE_REACTION
    =         (channelID, msgID, reaction) => [ 'channels', channelID, 'messages', msgID, 'reactions', reaction ]
  static CHANNEL_MESSAGE_REACTION_USER
    = (channelID, msgID, reaction, userID) => [ 'channels', channelID, 'messages', msgID, 'reactions', reaction, userID ]
  static CHANNEL_MESSAGE_REACTIONS
    =                   (channelID, msgID) => [ 'channels', channelID, 'messages', msgID, 'reactions' ]
  static CHANNEL_MESSAGE
    =                   (channelID, msgID) => [ 'channels', channelID, 'messages', msgID ]
  static CHANNEL_MESSAGES
    =                          (channelID) => [ 'channels', channelID, 'messages' ]
  static CHANNEL_MESSAGES_SEARCH
    =                          (channelID) => [ 'channels', channelID, 'messages', 'search' ]
  static CHANNEL_PERMISSION
    =                  (channelID, overID) => [ 'channels', channelID, 'permissions', overID ]
  static CHANNEL_PERMISSIONS
    =                          (channelID) => [ 'channels', channelID, 'permissions' ]
  static CHANNEL_PIN
    =                   (channelID, msgID) => [ 'channels', channelID, 'pins', msgID ]
  static CHANNEL_PINS
    =                          (channelID) => [ 'channels', channelID, 'pins' ]
  static CHANNEL_RECIPIENT
    =                    (groupID, userID) => [ 'channels', groupID, 'recipients', userID ]
  static CHANNEL_TYPING
    =                          (channelID) => [ 'channels', channelID, 'typing' ]
  static CHANNEL_WEBHOOKS
    =                          (channelID) => [ 'channels', channelID, 'webhooks' ]
  static CHANNELS
    =                                   () => [ 'channels' ]
  static CUSTOM_EMOJI_GUILD
    =                            (emojiID) => [ 'emojis', emojiID, 'guild' ]
  static DISCOVERY_CATEGORIES
    =                                   () => [ 'discovery', 'categories' ]
  static DISCOVERY_VALIDATION
    =                                   () => [ 'discovery', 'valid-term' ]
  static GATEWAY
    =                                   () => [ 'gateway' ]
  static GATEWAY_BOT
    =                                   () => [ 'gateway', 'bot' ]
  static GUILD
    =                            (guildID) => [ 'guilds', guildID ]
  static GUILD_AUDIT_LOGS
    =                            (guildID) => [ 'guilds', guildID, 'audit-logs' ]
  static GUILD_BAN
    =                  (guildID, memberID) => [ 'guilds', guildID, 'bans', memberID ]
  static GUILD_BANS
    =                            (guildID) => [ 'guilds', guildID, 'bans' ]
  static GUILD_CHANNELS
    =                            (guildID) => [ 'guilds', guildID, 'channels' ]
  static GUILD_DISCOVERY
    =                            (guildID) => [ 'guilds', guildID, 'discovery-metadata' ]
  static GUILD_DISCOVERY_CATEGORY
    =                (guildID, categoryID) => [ 'guilds', guildID, 'discovery-categories', categoryID ]
  static GUILD_EMBED
    =                            (guildID) => [ 'guilds', guildID, 'embed' ]
  static GUILD_EMOJI
    =                   (guildID, emojiID) => [ 'guilds', guildID, 'emojis', emojiID ]
  static GUILD_EMOJIS
    =                            (guildID) => [ 'guilds', guildID, 'emojis' ]
  static GUILD_INTEGRATION
    =             (guildID, integrationID) => [ 'guilds', guildID, 'integrations', integrationID ]
  static GUILD_INTEGRATION_SYNC
    =             (guildID, integrationID) => [ 'guilds', guildID, 'integrations', integrationID, 'sync' ]
  static GUILD_INTEGRATIONS
    =                            (guildID) => [ 'guilds', guildID, 'integrations' ]
  static GUILD_INVITES
    =                            (guildID) => [ 'guilds', guildID, 'invites' ]
  static GUILD_VANITY_URL
    =                            (guildID) => [ 'guilds', guildID, 'vanity-url' ]
  static GUILD_MEMBER
    =                  (guildID, memberID) => [ 'guilds', guildID, 'members', memberID ]
  static GUILD_MEMBER_NICK
    =                  (guildID, memberID) => [ 'guilds', guildID, 'members', memberID, 'nick' ]
  static GUILD_MEMBER_ROLE
    =          (guildID, memberID, roleID) => [ 'guilds', guildID, 'members', memberID, 'roles', roleID ]
  static GUILD_MEMBERS
    =                            (guildID) => [ 'guilds', guildID, 'members' ]
  static GUILD_MEMBERS_SEARCH
    =                            (guildID) => [ 'guilds', guildID, 'members', 'search' ]
  static GUILD_MESSAGES_SEARCH
    =                            (guildID) => [ 'guilds', guildID, 'messages', 'search' ]
  static GUILD_PREVIEW
    =                            (guildID) => [ 'guilds', guildID, 'preview' ]
  static GUILD_PRUNE
    =                            (guildID) => [ 'guilds', guildID, 'prune' ]
  static GUILD_ROLE
    =                    (guildID, roleID) => [ 'guilds', guildID, 'roles', roleID ]
  static GUILD_ROLES
    =                            (guildID) => [ 'guilds', guildID, 'roles' ]
  static GUILD_TEMPLATE
    =                               (code) => [ 'guilds', 'templates', code ]
  static GUILD_TEMPLATES
    =                            (guildID) => [ 'guilds', guildID, 'templates' ]
  static GUILD_TEMPLATE_GUILD
    =                      (guildID, code) => [ 'guilds', guildID, 'templates', code ]
  static GUILD_VOICE_REGIONS
    =                            (guildID) => [ 'guilds', guildID, 'regions' ]
  static GUILD_WEBHOOKS
    =                            (guildID) => [ 'guilds', guildID, 'webhooks' ]
  static GUILD_WELCOME_SCREEN
    =                            (guildID) => [ 'guilds', guildID, 'welcome-screen' ]
  static GUILD_WIDGET_SETTINGS
    =                            (guildID) => [ 'guilds', guildID, 'widget' ]
  static GUILD_WIDGET
    =                            (guildID) => [ 'guilds', guildID, 'widget.json' ]
  static GUILD_VOICE_STATE
    =                      (guildID, user) => [ 'guilds', guildID, 'voice-states', user ]
  static GUILDS
    =                                   () => [ 'guilds' ]
  static INVITE
    =                           (inviteID) => [ 'invites', inviteID ]
  static OAUTH2_APPLICATION
    =                              (appID) => [ 'oauth2', 'applications', appID ]
  static USER
    =                             (userID) => [ 'users', userID ]
  static USER_BILLING
    =                             (userID) => [ 'users', userID, 'billing' ]
  static USER_BILLING_PAYMENTS
    =                             (userID) => [ 'users', userID, 'billing', 'payments' ]
  static USER_BILLING_PREMIUM_SUBSCRIPTION
    =                             (userID) => [ 'users', userID, 'billing', 'premium-subscription' ]
  static USER_CHANNELS
    =                             (userID) => [ 'users', userID, 'channels' ]
  static USER_CONNECTIONS
    =                             (userID) => [ 'users', userID, 'connections' ]
  static USER_CONNECTION_PLATFORM
    =               (userID, platform, id) => [ 'users', userID, 'connections', platform, id ]
  static USER_GUILD
    =                    (userID, guildID) => [ 'users', userID, 'guilds', guildID ]
  static USER_GUILDS
    =                             (userID) => [ 'users', userID, 'guilds' ]
  static USER_MFA_CODES
    =                             (userID) => [ 'users', userID, 'mfa', 'codes' ]
  static USER_MFA_TOTP_DISABLE
    =                             (userID) => [ 'users', userID, 'mfa', 'totp', 'disable' ]
  static USER_MFA_TOTP_ENABLE
    =                             (userID) => [ 'users', userID, 'mfa', 'totp', 'enable' ]
  static USER_NOTE
    =                   (userID, targetID) => [ 'users', userID, 'note', targetID ]
  static USER_PROFILE
    =                             (userID) => [ 'users', userID, 'profile' ]
  static USER_RELATIONSHIP
    =                      (userID, relID) => [ 'users', userID, 'relationships', relID ]
  static USER_SETTINGS
    =                             (userID) => [ 'users', userID, 'settings' ]
  static USERS
    =                                   () => [ 'users' ]
  static VOICE_REGIONS
    =                                   () => [ 'voice', 'regions' ]
  static WEBHOOK
    =                             (hookID) => [ 'webhooks', hookID ]
  static WEBHOOK_MESSAGE
    =               (hookID, token, msgID) => [ 'webhooks', hookID, token, 'messages', msgID ]
  static WEBHOOK_SLACK
    =                             (hookID) => [ 'webhooks', hookID, 'slack' ]
  static WEBHOOK_TOKEN
    =                      (hookID, token) => [ 'webhooks', hookID, token ]
  static WEBHOOK_TOKEN_SLACK
    =                      (hookID, token) => [ 'webhooks', hookID, token, 'slack' ]

  // CDN Endpoints
  static ACHIEVEMENT_ICON
    = (applicationID, achievementID, icon) => [ 'app-assets', applicationID, 'achievements', achievementID, 'icons', icon ]
  static APPLICATION_ASSET
    =               (applicationID, asset) => [ 'app-assets', applicationID, asset ]
  static APPLICATION_ICON
    =                (applicationID, icon) => [ 'app-icons', applicationID, icon ]
  static CHANNEL_ICON
    =             (channelID, channelIcon) => [ 'channel-icons', channelID, channelIcon ]
  static CUSTOM_EMOJI
    =                            (emojiID) => [ 'emojis', emojiID ]
  static DEFAULT_USER_AVATAR
    =                  (userDiscriminator) => [ 'embed', 'avatars', userDiscriminator ]
  static GUILD_BANNER
    =               (guildID, guildBanner) => [ 'banners', guildID, guildBanner ]
  static GUILD_DISCOVERY_SPLASH
    =      (guildID, guildDiscoverySplash) => [ 'discovery-splashes', guildID, guildDiscoverySplash ]
  static GUILD_ICON
    =                 (guildID, guildIcon) => [ 'icons', guildID, guildIcon ]
  static GUILD_SPLASH
    =               (guildID, guildSplash) => [ 'splashes', guildID, guildSplash ]
  static TEAM_ICON
    =                   (teamID, teamIcon) => [ 'team-icons', teamID, teamIcon ]
  static USER_AVATAR
    =                 (userID, userAvatar) => [ 'avatars', userID, userAvatar ]

  // Client Endpoints
  static MESSAGE_LINK
    =     (guildID, channelID, messageID) => [ 'channels', guildID, channelID, messageID ]
}
