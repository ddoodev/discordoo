import {
  AnyRawGuildChannelData,
  FetchInviteQuery, FetchManyMessagesQuery, FetchReactionUsersOptions, GuildEmojiData, GuildMember,
  GuildMembersFetchQuery,
  MessageCreateData,
  RawAppCommandData, RawAppCommandEditData,
  RawEmojiEditData,
  RawGuildChannelCreateData, RawGuildChannelEditData,
  RawGuildEmojiData,
  RawGuildMemberAddData, RawGuildMemberData,
  RawGuildMemberEditData, RawInviteCreateData, RawInviteData, RawMessageData,
  RawPermissionOverwriteData, RawRoleCreateData, RawRoleData,
  RawRoleEditData,
  RawStickerCreateData,
  RawStickerData,
  RawStickerEditData,
  RawStickerPackData, RawThreadChannelCreateData, RawThreadChannelEditData,
  RawThreadChannelWithMessageCreateData, RawUserData
} from '@src/api'
import { Endpoints } from '@src/constants'
import { DiscordRestApplication } from '@src/core'
import { RawInteractionResponse } from '@src/api/entities/interaction/interfaces/RawInteractionResponseData'
import { RestFinishedResponse } from '@discordoo/providers'
import { RawDirectMessagesChannelData } from '@src/api/entities/channel/interfaces/RawDirectMessagesChannelData'

export class RestApplicationActions {
  constructor(public app: DiscordRestApplication) { }

  /**
   * Adds guild discovery subcategory
   *
   * @param guildId - guild id
   * @param categoryId - category id
   * @param reason - reason
   * @returns result
   */
  addGuildDiscoverySubcategory(guildId: string, categoryId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_DISCOVERY_CATEGORY(guildId, categoryId))
      .post({ reason })
  }

  // returns guild member data or empty string
  addGuildMember(guildId: string, memberId: string, data: RawGuildMemberAddData) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER(guildId, memberId))
      .body(data)
      .put<RawGuildMemberData | string>()
  }

  addGuildMemberRole(guildId: string, memberId: string, roleId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId))
      .put({ reason })
  }

  addReaction(channelId: string, messageId: string, emojiId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emojiId, '@me'))
      .put()
  }

  addThreadMember(channelId: string, memberId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_THREAD_MEMBER(channelId, memberId))
      .put()
  }

  addFollower(senderId: string, followerId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_FOLLOW(senderId))
      .body({ webhook_channel_id: followerId })
      .post({ reason })
  }

  removeThreadMember(channelId: string, memberId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_THREAD_MEMBER(channelId, memberId))
      .delete()
  }

  banGuildMember(guildId: string, userId: string, deleteMessagesDays = 0, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_BAN(guildId, userId))
      .body({ delete_message_days: deleteMessagesDays })
      .post({ reason })
  }

  createGuild(name: string, data: any /* TODO: GuildCreateData */) {
    return this.app.internals.rest.api()
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

  createGuildChannel(guildId: string, data: RawGuildChannelCreateData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_CHANNELS(guildId))
      .body(data)
      .post({ reason })
  }

  createGuildEmoji(guildId: string, data: GuildEmojiData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_EMOJIS(guildId))
      .body(data)
      .post({ reason })
  }

  createGuildRole(guildId: string, data: RawRoleCreateData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_ROLES(guildId))
      .body(data)
      .post<RawRoleData>({ reason })
  }

  createGuildFromTemplate(code: string, name: string, icon?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE(code))
      .body({ name, icon })
      .post()
  }

  createGuildTemplate(guildId: string, name: string, description?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATES(guildId))
      .body({ name, description })
      .post()
  }

  createThreadWithMessage(channelId: string, data: RawThreadChannelWithMessageCreateData, reason?: string) {
    const request = this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_THREADS(channelId, data.message_id))

    delete (data as any).message_id

    request.body(data)

    return request.post({ reason })
  }

  createThread(channelId: string, data: RawThreadChannelCreateData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_THREADS(channelId))
      .body(data)
      .post({ reason })
  }

  createMessage(channelId: string, data: MessageCreateData): RestFinishedResponse<RawMessageData> {
    const request = this.app.internals.rest.api().url(Endpoints.CHANNEL_MESSAGES(channelId))

    if (data.files.length) {
      request.attach(...data.files)
    }

    request.body({
      content: data.content,
      tts: data.tts,
      embeds: data.embeds?.length ? data.embeds : undefined,
      allowed_mentions: data.allowed_mentions,
      message_reference: data.message_reference,
      sticker_ids: data.stickers,
      components: data.components,
      flags: data.flags,
    })

    return request.post()
  }

  createGuildSticker(guildId: string, data: RawStickerCreateData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_STICKERS(guildId))
      .body({
        name: data.name,
        description: data.description,
        tags: data.tags
      })
      .attach(data.file)
      .post<RawStickerData>({ reason })
  }

  createInteractionResponse(interactionId: string, interactionToken: string, data: RawInteractionResponse) {
    const request = this.app.internals.rest.api()
      .url(Endpoints.INTERACTION_RESPONSE(interactionId, interactionToken))

    const body = data.data

    if (body && 'files' in body) {
      if (body.files.length) request.attach(...body.files)
      request.body({
        type: data.type,
        data: {
          content: body.content,
          tts: body.tts,
          embeds: body.embeds,
          allowed_mentions: body.allowed_mentions,
          components: body.components,
          flags: body.flags
        }
      })
    } else if (body) {
      request.body(data)
    }

    return request.post()
  }

  createInvite(channelId: string, data?: RawInviteCreateData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_INVITES(channelId))
      .body(data ? data : { })
      .post<RawInviteData>({ reason })
  }

  createUserChannel(userId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.USER_CHANNELS('@me'))
      .body({ recipient_id: userId })
      .post<RawDirectMessagesChannelData>()
  }

  deleteChannel(channelId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL(channelId))
      .delete({ reason })
  }

  deleteChannelPermissions(channelId: string, overwriteId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_PERMISSION(channelId, overwriteId))
      .delete({ reason })
  }

  deleteGuild(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD(guildId))
      .delete()
  }

  deleteMessage(channelId: string, messageId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE(channelId, messageId))
      .delete({ reason })
  }

  deleteMessagesBulk(channelId: string, messages: string[], reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_BULK_DELETE(channelId))
      .body({ messages })
      .post({ reason })
  }

  deleteGuildEmoji(guildId: string, emojiId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_EMOJI(guildId, emojiId))
      .delete({ reason })
  }

  deleteGuildRole(guildId: string, roleId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_ROLE(guildId, roleId))
      .delete({ reason })
  }

  deleteGuildIntegration(guildId: string, integrationId: string) { // TODO: check if reason available
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_INTEGRATION(guildId, integrationId))
      .delete()
  }

  deleteGuildTemplate(guildId: string, code: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE_GUILD(guildId, code))
      .delete()
  }

  deleteGuildSticker(guildId: string, stickerId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_STICKER(guildId, stickerId))
      .delete({ reason })
  }

  deleteInvite(inviteCode: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.INVITE(inviteCode))
      .delete<RawInviteData>({ reason })
  }

  editGuild(guildId: string, data: any /* TODO: GuildData */, reason?: string) {
    return this.app.internals.rest.api()
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

  editGuildChannel(channelId: string, data: RawGuildChannelEditData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL(channelId))
      .body(data)
      .patch<AnyRawGuildChannelData>({ reason })
  }

  editGuildChannelPermissions(channelId: string, data: RawPermissionOverwriteData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_PERMISSION(channelId, data.id))
      .body({
        allow: data.allow,
        deny: data.deny,
        type: data.type,
      })
      .put({ reason })
  }

  editThreadChannel(channelId: string, data: RawThreadChannelEditData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL(channelId))
      .body(data)
      .patch({ reason })
  }

  editGuildDiscovery(guildId: string, data: any /* TODO: GuildDiscoveryData */, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_DISCOVERY(guildId))
      .body({
        primary_category_id: data.primaryCategoryId,
        keywords: data.keywords,
        emoji_discoverability_enabled: data.emojiDiscoverabilityEnabled,
      })
      .patch({ reason })
  }

  editGuildEmoji(guildId: string, emojiId: string, data: RawEmojiEditData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_EMOJI(guildId, emojiId))
      .body(data)
      .patch<RawGuildEmojiData>({ reason })
  }

  // TODO: Check if reason available
  editGuildIntegration(guildId: string, integrationId: string, data: any /* TODO: GuildIntegrationData */) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_INTEGRATION(guildId, integrationId))
      .body({
        expire_behavior: data.expireBehavior,
        expire_grace_period: data.expireGracePeriod,
        enable_emoticons: data.enableEmoticons,
      })
      .patch()
  }

  editGuildMember(guildId: string, userId: string, data: RawGuildMemberEditData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER(guildId, userId))
      .body(data)
      .patch<RawGuildMemberData>({ reason })
  }

  editGuildRole(guildId: string, roleId: string, data: RawRoleEditData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_ROLE(guildId, roleId))
      .body(data)
      .patch<RawRoleData>({ reason })
  }

  editGuildTemplate(guildId: string, code: string, data: any /* TODO: GuildTemplateData */) { // TODO: check if reason available
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE_GUILD(guildId, code))
      .body(data)
      .patch()
  }

  editGuildVanity(guildId: string, code: string) { // TODO: check if reason available
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_VANITY_URL(guildId))
      .body({ code })
      .patch()
  }

  editGuildVoiceState(guildId: string, data: any /* TODO: GuildVoiceStateData */, user = '@me') { // TODO: check if reason available
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_VOICE_STATE(guildId, user))
      .body({
        channel_id: data.channelId,
        request_to_speak_timestamp: data.requestToSpeakTimestamp,
        suppress: data.suppress,
      })
      .patch()
  }

  editGuildWelcomeScreen(guildId: string, data: any /* TODO: GuildWelcomeScreenData */) { // TODO: check if reason available
    return this.app.internals.rest.api()
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
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_WIDGET(guildId))
      .body(data)
      .patch({ reason })
  }

  editGuildSticker(guildId: string, stickerId: string, data: RawStickerEditData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_STICKER(guildId, stickerId))
      .body(data)
      .patch<RawStickerData>({ reason })
  }

  getReactionUsers(
    channelId: string, messageId: string, emojiId: string, options?: FetchReactionUsersOptions
  ): RestFinishedResponse<RawUserData[]> {
    const request = this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_REACTION(channelId, messageId, emojiId))

    if (typeof options?.limit === 'number') {
      request.query({ limit: options.limit })
    }

    if (typeof options?.after === 'string') {
      request.query({ after: options.after })
    }

    return request.get<RawUserData[]>()
  }

  getPinnedMessages(channelId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_PINS(channelId))
      .get<RawMessageData[]>()
  }

  getMessage(channelId: string, messageId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE(channelId, messageId))
      .get<RawMessageData>()
  }

  getMessages(channelId: string, query: FetchManyMessagesQuery) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGES(channelId))
      .query(query)
      .get<RawMessageData[]>()
  }

  getGuildAuditLog(guildId: string, data: any /* TODO: GetGuildAuditLogData */) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_AUDIT_LOGS(guildId))
      .query({
        user_id: data.userId,
        action_type: data.actionType,
        before: data.before,
        limit: data.limit,
      })
      .get()
  }

  getChannel(channelId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL(channelId))
      .get()
  }

  getChannelInvites(channelId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_INVITES(channelId))
      .get<RawInviteData[]>()
  }

  getGuildBan(guildId: string, memberId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_BAN(guildId, memberId))
      .get()
  }

  getGuildBans(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_BANS(guildId))
      .get()
  }

  getGuildDiscovery(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_DISCOVERY(guildId))
      .get()
  }

  getGuildRoles(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_ROLES(guildId))
      .get<RawRoleData[]>()
  }

  getGuildIntegrations(guildId: string, data: any /* TODO: GetGuildIntegrationsData */ = {}) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_INTEGRATIONS(guildId))
      .query({
        include_applications: data.includeApplications ?? false,
      })
      .get()
  }

  getGuildInvites(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_INVITES(guildId))
      .get()
  }

  getGuildMember(guildId: string, memberId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER(guildId, memberId))
      .get<RawGuildMemberData>()
  }

  getGuildPreview(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_PREVIEW(guildId))
      .get()
  }

  getGuildTemplate(code: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE(code))
      .get()
  }

  getGuildVanity(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_VANITY_URL(guildId))
      .get()
  }

  getGuildWebhooks(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_WEBHOOKS(guildId))
      .get()
  }

  getGuildWelcomeScreen(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_WELCOME_SCREEN(guildId))
      .get()
  }

  getGuildWidget(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_WIDGET(guildId))
      .get()
  }

  getGuildEmoji(guildId: string, emojiId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_EMOJI(guildId, emojiId))
      .get<RawGuildEmojiData>()
  }

  getGuildSticker(guildId: string, stickerId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_STICKER(guildId, stickerId))
      .get<RawStickerData>()
  }

  getGuildStickers(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_STICKERS(guildId))
      .get<RawStickerData[]>()
  }

  getInvite(inviteCode: string, query?: FetchInviteQuery) {
    const request = this.app.internals.rest.api().url(Endpoints.INVITE(inviteCode))

    if (query) request.query(query)

    return request.get<RawInviteData>()
  }

  getListGuildMembers(guildId: string, query?: GuildMembersFetchQuery) {
    const request = this.app.internals.rest.api()
      .url(Endpoints.GUILD_MEMBERS(guildId))

    if (query) request.query(query)

    return request.get<GuildMember[]>()
  }

  getSticker(stickerId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.STICKER(stickerId))
      .get<RawStickerData>()
  }

  getNitroStickerPacks() {
    return this.app.internals.rest.api()
      .url(Endpoints.NITRO_STICKERS())
      .get<RawStickerPackData[]>()
  }

  getUser(userId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.USER(userId))
      .get<RawUserData>()
  }

  kickGuildMember(guildId: string, memberId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER(guildId, memberId))
      .delete({ reason })
  }

  leaveGuild(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.USER_GUILD('@me', guildId))
      .delete()
  }

  pruneGuildMembers(guildId: string, data: any /* GuildMembersPruneData */ = {}, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_PRUNE(guildId))
      .body({
        days: data.days,
        compute_prune_count: data.computePruneCount,
        include_roles: data.includeRoles,
      })
      .delete({ reason })
  }

  pinMessage(channelId: string, messageId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_PIN(channelId, messageId))
      .put({ reason })
  }

  removeGuildMemberRole(guildId: string, memberId: string, roleId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId))
      .delete({ reason })
  }

  removeReactionUsers(channelId: string, messageId: string, emojiId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_REACTION(channelId, messageId, emojiId))
      .delete()
  }

  removeReactionUser(channelId: string, messageId: string, emojiId: string, userId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emojiId, userId))
      .delete()
  }

  removeReactions(channelId: string, messageId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_REACTIONS(channelId, messageId))
      .delete()
  }

  searchGuildMembers(guildId: string, data: any /* TODO: GuildMembersSearchData */) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_MEMBERS_SEARCH(guildId))
      .query({
        query: data.query,
        limit: data.limit,
      })
      .get()
  }

  syncGuildIntegration(guildId: string, integrationId: string) { // TODO: check if reason available
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_INTEGRATION_SYNC(guildId, integrationId))
      .post()
  }

  syncGuildTemplate(guildId: string, code: string) { // TODO: check if reason available
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE_GUILD(guildId, code))
      .put()
  }

  unbanGuildMember(guildId: string, memberId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_BAN(guildId, memberId))
      .delete({ reason })
  }

  unpinMessage(channelId: string, messageId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_PIN(channelId, messageId))
      .delete({ reason })
  }
  createGlobalCommand(data: RawAppCommandEditData) {
    return this.app.internals.rest.api()
      .url(Endpoints.APPLICATION_COMMANDS(this.app.user.id))
      .body(data)
      .post<RawAppCommandData>()
  }
  getGlobalCommands() {
    return this.app.internals.rest.api()
      .url(Endpoints.APPLICATION_COMMANDS(this.app.user.id))
      .get<RawAppCommandData[]>()
  }
  getGlobalCommand(commandId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.APPLICATION_COMMAND(this.app.user.id, commandId))
      .get<RawAppCommandData>()
  }

  createGuildCommand(guildId: string, data: RawAppCommandEditData) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_COMMANDS(this.app.user.id, guildId))
      .body(data)
      .post<RawAppCommandData>()
  }

  getGuildCommands(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_COMMANDS(this.app.user.id, guildId))
      .get<RawAppCommandData[]>()
  }

  getGuildCommand(guildId: string, commandId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_COMMAND(this.app.user.id, guildId, commandId))
      .get<RawAppCommandData>()
  }
}
