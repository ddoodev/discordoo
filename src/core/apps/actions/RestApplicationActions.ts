import {
  AnyRawGuildChannelData,
  FetchInviteQuery,
  FetchManyMessagesQuery,
  FetchReactionUsersOptions,
  GuildEmojiData,
  GuildMember,
  GuildMembersFetchQuery,
  MessageCreateData,
  RawAppCommandData,
  RawAppCommandCreateData,
  RawEmojiEditData,
  RawGuildChannelCreateData,
  RawGuildChannelEditData,
  RawGuildEmojiData,
  RawGuildMemberAddData,
  RawGuildMemberData,
  RawGuildMemberEditData,
  RawInteractionResponse,
  RawInviteCreateData,
  RawInviteData,
  RawMessageData,
  RawPermissionOverwriteData,
  RawRoleCreateData,
  RawRoleData,
  RawRoleEditData,
  RawStickerCreateData,
  RawStickerData,
  RawStickerEditData,
  RawStickerPackData,
  RawThreadChannelCreateData,
  RawThreadChannelEditData,
  RawThreadChannelWithMessageCreateData,
  RawUserData,
  RawGuildAppCommandEditData,
  MessageEditData, InteractionMessageEditOptions, InteractionMessageCreateData
} from '@src/api'
import { Endpoints } from '@src/constants'
import { DiscordRestApplication } from '@src/core'
import { RestFinishedResponse } from '@discordoo/providers'
import { RawDirectMessagesChannelData } from '@src/api/entities/channel/interfaces/RawDirectMessagesChannelData'
import { FetchCommandQuery } from '@src/api/managers/interactions/FetchCommandQuery'
import { RawGuildCreateData } from '@src/api/entities/guild/interfaces/RawGuildCreateData'
import { RawGuildData } from '@src/api/entities/guild/interfaces/RawGuildData'

export class RestApplicationActions {
  constructor(public app: DiscordRestApplication) { }

  addFollower(senderId: string, followerId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_FOLLOW(senderId))
      .body({ webhook_channel_id: followerId })
      .post({ reason })
  }

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

  banGuildMember(guildId: string, userId: string, deleteMessagesDays = 0, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_BAN(guildId, userId))
      .body({ delete_message_days: deleteMessagesDays })
      .post({ reason })
  }

  createFollowUpMessage(id: string, token: string, data: InteractionMessageCreateData) {
    return this.app.internals.rest.api()
      .url(Endpoints.WEBHOOK_TOKEN(id, token))
      .body(data)
      .post<RawMessageData>()
  }

  createGlobalCommand(data: RawAppCommandCreateData) {
    return this.app.internals.rest.api()
      .url(Endpoints.APPLICATION_COMMANDS(this.app.user.id))
      .body(data)
      .post<RawAppCommandData>()
  }

  createGuild(data: RawGuildCreateData) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILDS())
      .body(data)
      .post<RawGuildData>()
  }

  createGuildChannel(guildId: string, data: RawGuildChannelCreateData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_CHANNELS(guildId))
      .body(data)
      .post({ reason })
  }

  createGuildCommand(guildId: string, data: RawAppCommandCreateData) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_COMMANDS(this.app.user.id, guildId))
      .body(data)
      .post<RawAppCommandData>()
  }

  createGuildEmoji(guildId: string, data: GuildEmojiData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_EMOJIS(guildId))
      .body(data)
      .post({ reason })
  }

  createGuildFromTemplate(code: string, name: string, icon?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE(code))
      .body({ name, icon })
      .post()
  }

  createGuildRole(guildId: string, data: RawRoleCreateData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_ROLES(guildId))
      .body(data)
      .post<RawRoleData>({ reason })
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

  createGuildTemplate(guildId: string, name: string, description?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATES(guildId))
      .body({ name, description })
      .post()
  }

  createInteractionResponse(interactionId: string, interactionToken: string, data: RawInteractionResponse) {
    const request = this.app.internals.rest.api()
      .url(Endpoints.INTERACTION_RESPONSE(interactionId, interactionToken))

    const body = data.data

    if (body && 'attachments' in body) {
      if (body.attachments) request.attach(...body.attachments)
      request.body({
        type: data.type,
        data: {
          content: body.content,
          tts: body.tts,
          embeds: body.embeds,
          allowed_mentions: body.allowed_mentions,
          components: body.components,
          flags: body.flags,
          attachments: body.attachments?.length === 0 ? [] : undefined
        }
      })
    } else {
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

  createMessage(channelId: string, data: MessageCreateData): RestFinishedResponse<RawMessageData> {
    const request = this.app.internals.rest.api().url(Endpoints.CHANNEL_MESSAGES(channelId))

    if (data.attachments) {
      request.attach(...data.attachments)
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
      attachments: data.attachments?.length === 0 ? [] : undefined
    })

    return request.post()
  }

  createThread(channelId: string, data: RawThreadChannelCreateData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_THREADS(channelId))
      .body(data)
      .post({ reason })
  }

  createThreadWithMessage(channelId: string, data: RawThreadChannelWithMessageCreateData, reason?: string) {
    const request = this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_THREADS(channelId, data.message_id))

    delete (data as any).message_id

    request.body(data)

    return request.post({ reason })
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

  deleteGlobalCommand(commandId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.APPLICATION_COMMAND(this.app.user.id, commandId))
      .delete()
  }

  deleteGuild(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD(guildId))
      .delete()
  }

  deleteGuildCommand(guildId: string, commandId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_COMMAND(this.app.user.id, guildId, commandId))
      .delete()
  }

  deleteGuildEmoji(guildId: string, emojiId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_EMOJI(guildId, emojiId))
      .delete({ reason })
  }

  deleteGuildIntegration(guildId: string, integrationId: string) { // TODO: check if reason available
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_INTEGRATION(guildId, integrationId))
      .delete()
  }

  deleteGuildRole(guildId: string, roleId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_ROLE(guildId, roleId))
      .delete({ reason })
  }

  deleteGuildSticker(guildId: string, stickerId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_STICKER(guildId, stickerId))
      .delete({ reason })
  }

  deleteGuildTemplate(guildId: string, code: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_TEMPLATE_GUILD(guildId, code))
      .delete()
  }

  deleteInteractionResponse(applicationId: string, interactionToken: string, messageId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.WEBHOOK_MESSAGE(applicationId, interactionToken, messageId))
      .delete()
  }

  deleteInvite(inviteCode: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.INVITE(inviteCode))
      .delete<RawInviteData>({ reason })
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

  editFollowUpMessage(applicationId: string, interactionToken: string, messageId: string, data: MessageEditData) {
    return this.app.internals.rest.api()
      .url(Endpoints.WEBHOOK_MESSAGE(applicationId, interactionToken, messageId))
      .body(data)
      .patch()
  }

  editGlobalCommand(commandId: string, data: RawGuildAppCommandEditData) {
    return this.app.internals.rest.api()
      .url(Endpoints.APPLICATION_COMMAND(this.app.user.id, commandId))
      .body(data)
      .patch<RawAppCommandData>()
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

  editGuildCommand(guildId: string, commandId: string, data: RawGuildAppCommandEditData) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_COMMAND(this.app.user.id, guildId, commandId))
      .body(data)
      .patch<RawAppCommandData>()
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

  editGuildSticker(guildId: string, stickerId: string, data: RawStickerEditData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_STICKER(guildId, stickerId))
      .body(data)
      .patch<RawStickerData>({ reason })
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

  editMessage(channelId: string, messageId: string, data: MessageEditData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE(channelId, messageId))
      .body(data)
      .patch<RawMessageData>({ reason })
  }

  editOriginalInteractionResponse(applicationId: string, interactionToken: string, data: InteractionMessageEditOptions, id: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.WEBHOOK_MESSAGE(applicationId, interactionToken, id))
      .body(data)
      .patch<RawMessageData>()
  }

  editThreadChannel(channelId: string, data: RawThreadChannelEditData, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL(channelId))
      .body(data)
      .patch({ reason })
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

  getFollowUpMessage(applicationId: string, interactionToken: string, messageId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.WEBHOOK_MESSAGE(applicationId, interactionToken, messageId))
      .get<RawMessageData>()
  }

  getGlobalCommand(commandId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.APPLICATION_COMMAND(this.app.user.id, commandId))
      .get<RawAppCommandData>()
  }

  getGlobalCommands(query?: FetchCommandQuery) {
    const request = this.app.internals.rest.api()
      .url(Endpoints.APPLICATION_COMMANDS(this.app.user.id))

    if (query) request.query(query)

    return request.get<RawAppCommandData[]>()
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

  getGuildCommand(guildId: string, commandId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_COMMAND(this.app.user.id, guildId, commandId))
      .get<RawAppCommandData>()
  }

  getGuildCommands(guildId: string, query?: FetchCommandQuery) {
    const request = this.app.internals.rest.api()
      .url(Endpoints.GUILD_COMMANDS(this.app.user.id, guildId))

    if (query) request.query(query)

    return request.get<RawAppCommandData[]>()
  }

  getGuildDiscovery(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_DISCOVERY(guildId))
      .get()
  }

  getGuildEmoji(guildId: string, emojiId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_EMOJI(guildId, emojiId))
      .get<RawGuildEmojiData>()
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

  getGuildRoles(guildId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_ROLES(guildId))
      .get<RawRoleData[]>()
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

  getNitroStickerPacks() {
    return this.app.internals.rest.api()
      .url(Endpoints.NITRO_STICKERS())
      .get<RawStickerPackData[]>()
  }

    getOriginalInteractionResponse(applicationId: string, interactionToken: string, messageId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.WEBHOOK_MESSAGE(applicationId, interactionToken, messageId))
      .get<RawMessageData>()
  }

  getPinnedMessages(channelId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_PINS(channelId))
      .get<RawMessageData[]>()
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

  getSticker(stickerId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.STICKER(stickerId))
      .get<RawStickerData>()
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

  overwriteGlobalCommandsBulk(commands: RawAppCommandCreateData[]) {
    return this.app.internals.rest.api()
      .url(Endpoints.APPLICATION_COMMANDS(this.app.user.id))
      .body(commands)
      .put<RawAppCommandData[]>()
  }

  overwriteGuildCommandsBulk(guildId: string, commands: RawAppCommandCreateData[]) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_COMMANDS(this.app.user.id, guildId))
      .body(commands)
      .put()
  }

  pinMessage(channelId: string, messageId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_PIN(channelId, messageId))
      .put({ reason })
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

  removeGuildMemberRole(guildId: string, memberId: string, roleId: string, reason?: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId))
      .delete({ reason })
  }

  removeReactionUser(channelId: string, messageId: string, emojiId: string, userId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emojiId, userId))
      .delete()
  }

  removeReactionUsers(channelId: string, messageId: string, emojiId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_REACTION(channelId, messageId, emojiId))
      .delete()
  }

  removeReactions(channelId: string, messageId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_REACTIONS(channelId, messageId))
      .delete()
  }

  removeThreadMember(channelId: string, memberId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_THREAD_MEMBER(channelId, memberId))
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

  triggerTyping(channelId: string) {
    return this.app.internals.rest.api()
      .url(Endpoints.CHANNEL_TYPING(channelId))
      .post()
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
}
