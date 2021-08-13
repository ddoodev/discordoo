import { Client } from '@src/core'
import { Endpoints } from '@src/constants'

export class ClientActions {
  public client: Client

  constructor(client: Client) {
    this.client = client
  }

  addGuildDiscoverySubcategory(guildID: string, categoryID: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_DISCOVERY_CATEGORY(guildID, categoryID))
      .post({ reason })
  }

  addGuildMemberRole(guildID: string, memberID: string, roleID: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER_ROLE(guildID, memberID, roleID))
      .put({ reason })
  }

  banGuildMember(guildID: string, userID: string, deleteMessagesDays = 0, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_BAN(guildID, userID))
      .body({ delete_message_days: deleteMessagesDays })
      .post({ reason })
  }

  createGuild(name: string, data: any /* TODO: GuildCreateData */) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILDS())
      .body({
        name,
        region: data.region,
        icon: data.icon,
        verification_level: data.verificationLevel,
        default_message_notifications: data.defaultNotifications,
        explicit_content_filter: data.explicitContentFilter,
        system_channel_id: data.systemChannelID,
        afk_channel_id: data.afkChannelID,
        afk_timeout: data.afkTimeout,
        roles: data.roles,
        channels: data.channels,
      })
      .post()
  }

  createGuildEmoji(guildID: string, data: any /* TODO: GuildEmojiData */, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_EMOJIS(guildID))
      .body(data)
      .post({ reason })
  }

  createGuildFromTemplate(code: string, name: string, icon?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE(code))
      .body({ name, icon })
      .post()
  }

  createGuildTemplate(guildID: string, name: string, description?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATES(guildID))
      .body({ name, description })
      .post()
  }

  deleteGuild(guildID: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD(guildID))
      .delete()
  }

  deleteGuildEmoji(guildID: string, emojiID: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_EMOJI(guildID, emojiID))
      .delete({ reason })
  }

  deleteGuildIntegration(guildID: string, integrationID: string) { // TODO: check if reason available
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_INTEGRATION(guildID, integrationID))
      .delete()
  }

  deleteGuildTemplate(guildID: string, code: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE_GUILD(guildID, code))
      .delete()
  }

  editGuild(guildID: string, data: any /* TODO: GuildData */, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD(guildID))
      .body({
        name: data.name,
        region: data.region,
        icon: data.icon,
        verification_level: data.verificationLevel,
        default_message_notifications: data.defaultNotifications,
        explicit_content_filter: data.explicitContentFilter,
        system_channel_id: data.systemChannelID,
        system_channel_flags: data.systemChannelFlags,
        rules_channel_id: data.rulesChannelID,
        public_updates_channel_id: data.publicUpdatesChannelID,
        preferred_locale: data.preferredLocale,
        afk_channel_id: data.afkChannelID,
        afk_timeout: data.afkTimeout,
        owner_id: data.ownerID,
        splash: data.splash,
        banner: data.banner,
        description: data.description,
        discovery_splash: data.discoverySplash,
        features: data.features,
      })
      .patch({ reason })
  }

  editGuildDiscovery(guildID: string, data: any /* TODO: GuildDiscoveryData */, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_DISCOVERY(guildID))
      .body({
        primary_category_id: data.primaryCategoryID,
        keywords: data.keywords,
        emoji_discoverability_enabled: data.emojiDiscoverabilityEnabled
      })
      .patch({ reason })
  }

  editGuildEmoji(guildID: string, emojiID: string, data: any /* TODO: GuildEmojiData */, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_EMOJI(guildID, emojiID))
      .body(data)
      .patch({ reason })
  }

  // TODO: Check if reason available
  editGuildIntegration(guildID: string, integrationID: string, data: any /* TODO: GuildIntegrationData */) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_INTEGRATION(guildID, integrationID))
      .body({
        expire_behavior: data.expireBehavior,
        expire_grace_period: data.expireGracePeriod,
        enable_emoticons: data.enableEmoticons
      })
      .patch()
  }

  editGuildMember(guildID: string, memberID: string, data: any /* TODO: GuildMemberData */, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER(guildID, memberID))
      .body({
        roles: data.roles,
        nick: data.nick,
        mute: data.mute,
        deaf: data.deaf,
        channel_id: data.channelID
      })
      .patch({ reason })
  }

  editGuildTemplate(guildID: string, code: string, data: any /* TODO: GuildTemplateData */) { // TODO: check if reason available
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE_GUILD(guildID, code))
      .body(data)
      .patch()
  }


}
