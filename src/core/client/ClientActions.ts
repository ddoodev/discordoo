import { Client } from '@src/core'
import { Endpoints } from '@src/constants'
import { MessageCreateData } from '@src/api/entities/message/interfaces/MessageCreateData'
import { RestFinishedResponse } from '@discordoo/providers'
import { RawMessageData } from '@src/api/entities/message/interfaces/RawMessageData'
import { RawEmojiEditData } from '@src/api/entities/emoji/interfaces/RawEmojiEditData'
import { RawGuildEmojiData } from '@src/api/entities/emoji/interfaces/RawGuildEmojiData'
import { RawStickerData } from '@src/api/entities/sticker/interfaces/RawStickerData'
import { RawUserData } from '@src/api/entities/user/interfaces/RawUserData'
import { RawStickerEditData } from '@src/api/entities/sticker/interfaces/RawStickerEditData'
import { RawStickerCreateData } from '@src/api/entities/sticker/interfaces/RawStickerCreateData'
import { RawStickerPackData } from '@src/api/entities/sticker'

export class ClientActions {
  public client: Client

  constructor(client: Client) {
    this.client = client
  }

  addGuildDiscoverySubcategory(guildId: string, categoryId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_DISCOVERY_CATEGORY(guildId, categoryId))
      .post({ reason })
  }

  addGuildMemberRole(guildId: string, memberId: string, roleId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId))
      .put({ reason })
  }

  banGuildMember(guildId: string, userId: string, deleteMessagesDays = 0, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_BAN(guildId, userId))
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
        system_channel_id: data.systemChannelId,
        afk_channel_id: data.afkChannelId,
        afk_timeout: data.afkTimeout,
        roles: data.roles,
        channels: data.channels,
      })
      .post()
  }

  createGuildEmoji(guildId: string, data: any /* TODO: GuildEmojiData */, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_EMOJIS(guildId))
      .body(data)
      .post({ reason })
  }

  createGuildFromTemplate(code: string, name: string, icon?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE(code))
      .body({ name, icon })
      .post()
  }

  createGuildTemplate(guildId: string, name: string, description?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATES(guildId))
      .body({ name, description })
      .post()
  }

  createMessage(channelId: string, data: MessageCreateData): RestFinishedResponse<RawMessageData> {
    const request = this.client.internals.rest.api().url(Endpoints.CHANNEL_MESSAGES(channelId))

    if (data.files.length) {
      request.attach(...data.files)
    }

    request.body({
      content: data.content,
      tts: data.tts,
      embeds: data.embeds.length ? data.embeds : undefined,
      allowed_mentions: data.allowed_mentions,
      message_reference: data.message_reference,
      sticker_ids: data.stickers,
      components: data.components
    })

    return request.post()
  }

  createGuildSticker(guildId: string, data: RawStickerCreateData, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_STICKERS(guildId))
      .body({
        name: data.name,
        description: data.description,
        tags: data.tags
      })
      .attach(data.file)
      .post<RawStickerData>({ reason })
  }

  deleteChannel(channelId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL(channelId))
      .delete({ reason })
  }

  deleteGuild(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD(guildId))
      .delete()
  }

  deleteGuildEmoji(guildId: string, emojiId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_EMOJI(guildId, emojiId))
      .delete({ reason })
  }

  deleteGuildIntegration(guildId: string, integrationId: string) { // TODO: check if reason available
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_INTEGRATION(guildId, integrationId))
      .delete()
  }

  deleteGuildTemplate(guildId: string, code: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE_GUILD(guildId, code))
      .delete()
  }

  deleteGuildSticker(guildId: string, stickerId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_STICKER(guildId, stickerId))
      .delete({ reason })
  }

  editGuild(guildId: string, data: any /* TODO: GuildData */, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD(guildId))
      .body({
        name: data.name,
        region: data.region,
        icon: data.icon,
        verification_level: data.verificationLevel,
        default_message_notifications: data.defaultNotifications,
        explicit_content_filter: data.explicitContentFilter,
        system_channel_id: data.systemChannelId,
        system_channel_flags: data.systemChannelFlags,
        rules_channel_id: data.rulesChannelId,
        public_updates_channel_id: data.publicUpdatesChannelId,
        preferred_locale: data.preferredLocale,
        afk_channel_id: data.afkChannelId,
        afk_timeout: data.afkTimeout,
        owner_id: data.ownerId,
        splash: data.splash,
        banner: data.banner,
        description: data.description,
        discovery_splash: data.discoverySplash,
        features: data.features,
      })
      .patch({ reason })
  }

  editGuildDiscovery(guildId: string, data: any /* TODO: GuildDiscoveryData */, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_DISCOVERY(guildId))
      .body({
        primary_category_id: data.primaryCategoryId,
        keywords: data.keywords,
        emoji_discoverability_enabled: data.emojiDiscoverabilityEnabled,
      })
      .patch({ reason })
  }

  editGuildEmoji(guildId: string, emojiId: string, data: RawEmojiEditData, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_EMOJI(guildId, emojiId))
      .body(data)
      .patch<RawGuildEmojiData>({ reason })
  }

  // TODO: Check if reason available
  editGuildIntegration(guildId: string, integrationId: string, data: any /* TODO: GuildIntegrationData */) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_INTEGRATION(guildId, integrationId))
      .body({
        expire_behavior: data.expireBehavior,
        expire_grace_period: data.expireGracePeriod,
        enable_emoticons: data.enableEmoticons,
      })
      .patch()
  }

  editGuildMember(guildId: string, memberId: string, data: any /* TODO: GuildMemberData */, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER(guildId, memberId))
      .body({
        roles: data.roles,
        nick: data.nick,
        mute: data.mute,
        deaf: data.deaf,
        channel_id: data.channelId,
      })
      .patch({ reason })
  }

  editGuildTemplate(guildId: string, code: string, data: any /* TODO: GuildTemplateData */) { // TODO: check if reason available
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE_GUILD(guildId, code))
      .body(data)
      .patch()
  }

  editGuildVanity(guildId: string, code: string) { // TODO: check if reason available
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_VANITY_URL(guildId))
      .body({ code })
      .patch()
  }

  editGuildVoiceState(guildId: string, data: any /* TODO: GuildVoiceStateData */, user = '@me') { // TODO: check if reason available
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_VOICE_STATE(guildId, user))
      .body({
        channel_id: data.channelId,
        request_to_speak_timestamp: data.requestToSpeakTimestamp,
        suppress: data.suppress,
      })
      .patch()
  }

  editGuildWelcomeScreen(guildId: string, data: any /* TODO: GuildWelcomeScreenData */) { // TODO: check if reason available
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_WELCOME_SCREEN(guildId))
      .body({
        description: data.description,
        enabled: data.enabled,
        welcome_screens: data.welcomeScreens.map((c) => ({
          channel_id: c.channelId,
          description: c.description,
          emoji_id: c.emojiId,
          emoji_name: c.emojiName,
        })),
      })
      .patch()
  }

  editGuildWidget(guildId: string, data: any /* TODO: GuildWidgetData */, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_WIDGET(guildId))
      .body(data)
      .patch({ reason })
  }

  editGuildSticker(guildId: string, stickerId: string, data: RawStickerEditData, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_STICKER(guildId, stickerId))
      .body(data)
      .patch<RawStickerData>({ reason })
  }

  getGuildAuditLog(guildId: string, data: any /* TODO: GetGuildAuditLogData */) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_AUDIT_LOGS(guildId))
      .query({
        user_id: data.userId,
        action_type: data.actionType,
        before: data.before,
        limit: data.limit,
      })
      .get()
  }

  getGuildBan(guildId: string, memberId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_BAN(guildId, memberId))
      .get()
  }

  getGuildBans(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_BANS(guildId))
      .get()
  }

  getGuildDiscovery(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_DISCOVERY(guildId))
      .get()
  }

  getGuildIntegrations(guildId: string, data: any /* TODO: GetGuildIntegrationsData */ = {}) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_INTEGRATIONS(guildId))
      .query({
        include_applications: data.includeApplications ?? false,
      })
      .get()
  }

  getGuildInvites(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_INVITES(guildId))
      .get()
  }

  getGuildPreview(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_PREVIEW(guildId))
      .get()
  }

  getGuildTemplate(code: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE(code))
      .get()
  }

  getGuildVanity(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_VANITY_URL(guildId))
      .get()
  }

  getGuildWebhooks(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_WEBHOOKS(guildId))
      .get()
  }

  getGuildWelcomeScreen(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_WELCOME_SCREEN(guildId))
      .get()
  }

  getGuildWidget(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_WIDGET(guildId))
      .get()
  }

  getGuildEmoji(guildId: string, emojiId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_EMOJI(guildId, emojiId))
      .get<RawGuildEmojiData>()
  }

  getGuildSticker(guildId: string, stickerId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_STICKER(guildId, stickerId))
      .get<RawStickerData>()
  }

  getGuildStickers(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_STICKERS(guildId))
      .get<RawStickerData[]>()
  }

  getSticker(stickerId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.STICKER(stickerId))
      .get<RawStickerData>()
  }

  getNitroStickerPacks() {
    return this.client.internals.rest.api()
      .url(Endpoints.NITRO_STICKERS())
      .get<RawStickerPackData[]>()
  }

  getUser(userId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.USER(userId))
      .get<RawUserData>()
  }

  kickGuildMember(guildId: string, memberId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER(guildId, memberId))
      .delete({ reason })
  }

  leaveGuild(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.USER_GUILD('@me', guildId))
      .delete()
  }

  pruneGuildMembers(guildId: string, data: any /* GuildMembersPruneData */ = {}, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_PRUNE(guildId))
      .body({
        days: data.days,
        compute_prune_count: data.computePruneCount,
        include_roles: data.includeRoles,
      })
      .delete({ reason })
  }

  removeGuildMemberRole(guildId: string, memberId: string, roleId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId))
      .delete({ reason })
  }

  searchGuildMembers(guildId: string, data: any /* TODO: GuildMembersSearchData */) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_MEMBERS_SEARCH(guildId))
      .query({
        query: data.query,
        limit: data.limit,
      })
      .get()
  }

  syncGuildIntegration(guildId: string, integrationId: string) { // TODO: check if reason available
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_INTEGRATION_SYNC(guildId, integrationId))
      .post()
  }

  syncGuildTemplate(guildId: string, code: string) { // TODO: check if reason available
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE_GUILD(guildId, code))
      .put()
  }

  unbanGuildMember(guildId: string, memberId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_BAN(guildId, memberId))
      .delete({ reason })
  }

}
