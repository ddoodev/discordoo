import { Client } from '@src/core'
import { Endpoints } from '@src/constants'
import { MessageCreateData } from '@src/api/entities/message/interfaces/MessageCreateData'
import { GatewayOpCodes, RestFinishedResponse } from '@discordoo/providers'
import { RawMessageData } from '@src/api/entities/message/interfaces/RawMessageData'
import { RawEmojiEditData } from '@src/api/entities/emoji/interfaces/RawEmojiEditData'
import { RawGuildEmojiData } from '@src/api/entities/emoji/interfaces/RawGuildEmojiData'
import { RawStickerData } from '@src/api/entities/sticker/interfaces/RawStickerData'
import { RawUserData } from '@src/api/entities/user/interfaces/RawUserData'
import { RawStickerEditData } from '@src/api/entities/sticker/interfaces/RawStickerEditData'
import { RawStickerCreateData } from '@src/api/entities/sticker/interfaces/RawStickerCreateData'
import { RawStickerPackData } from '@src/api/entities/sticker'
import { RawGuildMemberEditData } from '@src/api/entities/member/interfaces/RawGuildMemberEditData'
import { GuildMember, RawGuildMemberData } from '@src/api'
import { RawRoleEditData } from '@src/api/entities/role/interfaces/RawRoleEditData'
import { RawRoleData } from '@src/api/entities/role/interfaces/RawRoleData'
import { RawRoleCreateData } from '@src/api/entities/role/interfaces/RawRoleCreateData'
import { FetchReactionUsersOptions } from '@src/api/managers/reactions/FetchReactionUsersOptions'
import { RawGuildChannelEditData } from '@src/api/entities/channel/interfaces/RawGuildChannelEditData'
import { RawAbstractGuildChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildChannelData'
import { RawThreadChannelEditData } from '@src/api/entities/channel/interfaces/RawThreadChannelEditData'
import { RawPermissionOverwriteData } from '@src/api/entities/overwrite/interfaces/RawPermissionOverwriteData'
import { RawGuildChannelCreateData } from '@src/api/entities/channel/interfaces/RawGuildChannelCreateData'
import { RawThreadChannelWithMessageCreateData } from '@src/api/entities/channel/interfaces/RawThreadChannelWithMessageCreateData'
import { RawThreadChannelCreateData } from '@src/api/entities/channel/interfaces/RawThreadChannelCreateData'
import { FetchManyMessagesQuery } from '@src/api/managers/messages/FetchManyMessagesQuery'
import { RawGuildMembersFetchOptions } from '@src/api/managers/members/RawGuildMembersFetchOptions'
import { GuildMembersChunkEventContext } from '@src/events'
import { DiscordooError, DiscordSnowflake, ValidationError } from '@src/utils'
import { GuildMembersChunkHandlerContext } from '@src/events/interfaces/GuildMembersChunkHandlerContext'
import { is } from 'typescript-is'
import { RawGuildMemberAddData } from '@src/api/managers/members/RawGuildMemberAddData'

export class ClientActions {
  public client: Client

  constructor(client: Client) {
    this.client = client
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
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_DISCOVERY_CATEGORY(guildId, categoryId))
      .post({ reason })
  }

  // returns guild member data or empty string
  addGuildMember(guildId: string, memberId: string, data: RawGuildMemberAddData) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER(guildId, memberId))
      .body(data)
      .put<RawGuildMemberData | string>()
  }

  addGuildMemberRole(guildId: string, memberId: string, roleId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId))
      .put({ reason })
  }

  addReaction(channelId: string, messageId: string, emojiId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emojiId, '@me'))
      .put()
  }

  addThreadMember(channelId: string, memberId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_THREAD_MEMBER(channelId, memberId))
      .put()
  }

  addFollower(senderId: string, followerId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_FOLLOW(senderId))
      .body({ webhook_channel_id: followerId })
      .post({ reason })
  }

  removeThreadMember(channelId: string, memberId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_THREAD_MEMBER(channelId, memberId))
      .delete()
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

  createGuildChannel(guildId: string, data: RawGuildChannelCreateData, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_CHANNELS(guildId))
      .body(data)
      .post({ reason })
  }

  createGuildEmoji(guildId: string, data: any /* TODO: GuildEmojiData */, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_EMOJIS(guildId))
      .body(data)
      .post({ reason })
  }

  createGuildRole(guildId: string, data: RawRoleCreateData, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_ROLES(guildId))
      .body(data)
      .post<RawRoleData>({ reason })
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

  createThreadWithMessage(channelId: string, data: RawThreadChannelWithMessageCreateData, reason?: string) {
    const request = this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_THREADS(channelId, data.message_id))

    delete (data as any).message_id

    request.body(data)

    return request.post({ reason })
  }

  createThread(channelId: string, data: RawThreadChannelCreateData, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_THREADS(channelId))
      .body(data)
      .post({ reason })
  }

  createMessage(channelId: string, data: MessageCreateData): RestFinishedResponse<RawMessageData> {
    const request = this.client.internals.rest.api().url(Endpoints.CHANNEL_MESSAGES(channelId))

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

  deleteChannelPermissions(channelId: string, overwriteId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_PERMISSION(channelId, overwriteId))
      .delete({ reason })
  }

  deleteGuild(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD(guildId))
      .delete()
  }

  deleteMessage(channelId: string, messageId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE(channelId, messageId))
      .delete({ reason })
  }

  deleteMessagesBulk(channelId: string, messages: string[], reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_BULK_DELETE(channelId))
      .body({ messages })
      .post({ reason })
  }

  deleteGuildEmoji(guildId: string, emojiId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_EMOJI(guildId, emojiId))
      .delete({ reason })
  }

  deleteGuildRole(guildId: string, roleId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_ROLE(guildId, roleId))
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

  editGuildChannel(channelId: string, data: RawGuildChannelEditData, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL(channelId))
      .body(data)
      .patch<RawAbstractGuildChannelData>({ reason })
  }

  editGuildChannelPermissions(channelId: string, data: RawPermissionOverwriteData, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_PERMISSION(channelId, data.id))
      .body({
        allow: data.allow,
        deny: data.deny,
        type: data.type,
      })
      .put({ reason })
  }

  editThreadChannel(channelId: string, data: RawThreadChannelEditData, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL(channelId))
      .body(data)
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

  editGuildMember(guildId: string, userId: string, data: RawGuildMemberEditData, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER(guildId, userId))
      .body(data)
      .patch<RawGuildMemberData>({ reason })
  }

  editGuildRole(guildId: string, roleId: string, data: RawRoleEditData, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_ROLE(guildId, roleId))
      .body(data)
      .patch<RawRoleData>({ reason })
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

  getReactionUsers(
    channelId: string, messageId: string, emojiId: string, options?: FetchReactionUsersOptions
  ): RestFinishedResponse<RawUserData[]> {
    const request = this.client.internals.rest.api()
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
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_PINS(channelId))
      .get<RawMessageData[]>()
  }

  getMessage(channelId: string, messageId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE(channelId, messageId))
      .get<RawMessageData>()
  }

  getMessages(channelId: string, query: FetchManyMessagesQuery) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGES(channelId))
      .query(query)
      .get<RawMessageData[]>()
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

  getChannel(channelId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL(channelId))
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

  getGuildRoles(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_ROLES(guildId))
      .get<RawRoleData[]>()
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

  getGuildMember(guildId: string, memberId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER(guildId, memberId))
      .get<RawGuildMemberData>()
  }

  fetchWsGuildMembers(shardId: number, options: RawGuildMembersFetchOptions): Promise<GuildMember[]> {
    if (!is<RawGuildMembersFetchOptions>(options)) {
      throw new ValidationError(undefined, 'Invalid members fetch options')._setInvalidOptions(options)
    }

    if (isNaN(shardId)) {
      throw new ValidationError(undefined, 'Invalid shardId for fetching members:', shardId)
    }

    const nonce = options.nonce ?? DiscordSnowflake.generate()

    let context: any
    return new Promise((resolve, reject) => {

      const handler = (eventContext: GuildMembersChunkEventContext, executionContext: GuildMembersChunkHandlerContext) => {
        if (eventContext.nonce === executionContext.nonce) {
          executionContext.fetched.push(eventContext.members)
          executionContext.timeout.refresh()
        }

        if (eventContext.last) {
          clearTimeout(executionContext.timeout)
          executionContext.resolve(executionContext.fetched.flat())
          return true
        }

        return executionContext
      }

      const timeout = setTimeout(() => {
        if (this.client.internals.queues.members.has(nonce)) {
          this.client.internals.queues.members.delete(nonce)
          const err = new DiscordooError(undefined, 'Guild members fetching stopped due to timeout.')
          reject(err)
        }
      }, 120_000)

      context = {
        handler,
        timeout,
        resolve,
        reject,
        nonce,
        fetched: []
      }

      this.client.internals.queues.members.set(nonce, context)
      this.client.internals.gateway.send({
        op: GatewayOpCodes.REQUEST_GUILD_MEMBERS,
        d: {
          ...options,
          nonce
        }
      }, { shards: [ shardId ]})
    })
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

  listGuildMembers(guildId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_MEMBERS(guildId))
      .get<RawGuildMemberData[]>()
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

  pinMessage(channelId: string, messageId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_PIN(channelId, messageId))
      .put({ reason })
  }

  removeGuildMemberRole(guildId: string, memberId: string, roleId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId))
      .delete({ reason })
  }

  removeReactionUsers(channelId: string, messageId: string, emojiId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_REACTION(channelId, messageId, emojiId))
      .delete()
  }

  removeReactionUser(channelId: string, messageId: string, emojiId: string, userId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emojiId, userId))
      .delete()
  }

  removeReactions(channelId: string, messageId: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_MESSAGE_REACTIONS(channelId, messageId))
      .delete()
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

  unpinMessage(channelId: string, messageId: string, reason?: string) {
    return this.client.internals.rest.api()
      .url(Endpoints.CHANNEL_PIN(channelId, messageId))
      .delete({ reason })
  }

}
