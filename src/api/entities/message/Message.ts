import { AbstractEntity } from '../../../../src/api/entities/AbstractEntity'
import { ToJsonProperties } from '../../../../src/api/entities/interfaces/ToJsonProperties'
import { Json } from '../../../../src/api/entities/interfaces/Json'
import {
  Guild,
  GuildMember,
  MessageAttachment,
  MessageContent,
  MessageCreateOptions,
  MessageData,
  MessageEmbed,
  RawMessageAttachmentData,
  RawMessageData,
  RawMessageEmbedData,
  ReadonlyMessageFlagsUtil,
  User
} from '../../../../src/api'
import { MessageReactionsManager } from '../../../../src/api/managers/reactions'
import { Keyspaces, MessageTypes } from '../../../../src/constants'
import { attach, resolveMessageReaction } from '../../../../src/utils'
import { AnyWritableChannel } from '../../../../src/api/entities/channel/interfaces/AnyWritableChannel'
import { CacheManagerGetOptions } from '../../../../src/cache'
import { EntitiesUtil } from '../../../../src/api/entities/EntitiesUtil'
import { EntityInitOptions } from '../../../../src/api/entities/EntityInitOptions'

export class Message extends AbstractEntity {
  public attachments: MessageAttachment[] = []
  public declare authorId: string
  public declare channelId: string
  public declare content: string
  public deleted?: boolean
  public editedTimestamp?: number
  public embeds: MessageEmbed[] = []
  public declare flags: ReadonlyMessageFlagsUtil
  public guildId?: string
  public declare id: string
  // MessageMentionsManager
  // mentionChannels: ChannelMentionData[]
  // mentionEveryone: boolean
  // mentionRoles: string[]
  // mentionUsers: string[]
  public declare nonce: string | number
  public declare pinned: boolean
  public declare reactions: MessageReactionsManager
  public referencedMessageId?: string
  public declare createdTimestamp: number
  public declare tts: boolean
  public declare type: MessageTypes
  public declare webhookId: string

  async init(data: MessageData | RawMessageData, options?: EntityInitOptions): Promise<this> {

    if (data.embeds?.length) {
      const Embed = EntitiesUtil.get('MessageEmbed')
      const embeds: MessageEmbed[] = []
      for await (const emb of data.embeds) {
        embeds.push(await new Embed(this.app).init(emb as RawMessageEmbedData))
      }
      data.embeds = embeds
    }

    if (!('authorId' in data)) {
      (data as any).authorId = data.author.id
    }

    data.flags = new ReadonlyMessageFlagsUtil(data.flags)

    if (data.attachments?.length) {
      const Attachment = EntitiesUtil.get('MessageAttachment')
      const attachments: MessageAttachment[] = []
      for await (const at of data.attachments) {
        attachments.push(await new Attachment(this.app).init(at as RawMessageAttachmentData))
      }
      data.attachments = attachments
    }

    if ('referenced_message' in data && data.referenced_message) {
      const Message = EntitiesUtil.get('Message')
      const msg = await new Message(this.app).init(data.referenced_message)
      await this.app.messages.cache.set(msg.id, msg, { storage: this.channelId });
      (data as any).referencedMessageId = msg.id
    }

    attach(this, data, {
      props: [
        'embeds',
        [ 'channelId', 'channel_id' ],
        [ 'guildId', 'guild_id' ],
        'content',
        'id',
        'nonce',
        'pinned',
        'tts',
        'type',
        'deleted',
        'authorId',
        'flags',
        'attachments',
        'referencedMessageId',
        [ 'webhookId', 'webhook_id' ],
        [ 'createdTimestamp', 'created_timestamp' ],
        [ 'editedTimestamp', 'edited_timestamp' ],
      ],
      disabled: options?.ignore,
      enabled: [ 'id', 'type', 'guildId', 'channelId', 'createdTimestamp', 'deleted', 'authorId', 'attachments' ]
    })

    if (typeof this.createdTimestamp === 'string'!) { // discord sends timestamps in strings
      this.createdTimestamp = new Date(this.createdTimestamp).getTime()
    }

    if (this.editedTimestamp && typeof this.editedTimestamp === 'string'!) { // discord sends timestamps in strings
      this.editedTimestamp = new Date(this.editedTimestamp).getTime()
    }

    if (!this.reactions) {
      this.reactions = new MessageReactionsManager(this.app, {
        messageId: this.id,
        channelId: this.channelId
      })
    }

    if (data.reactions?.length) {
      await this.reactions.cache.clear()

      for await (const reactionData of data.reactions) {
        const reaction = await resolveMessageReaction(this.app, reactionData)
        if (reaction) await this.reactions.cache.set(reaction.emojiId, reaction)
      }
    }

    return this
  }

  reply(content: MessageContent, options?: MessageCreateOptions) {
    return this.app.messages.create(this.channelId, content, {
      ...options,
      messageReference: {
        guild: this.guildId,
        channel: this.channelId,
        message: this.id,
      }
    })
  }

  async delete(reason?: string): Promise<this | undefined> {
    const result = await this.app.messages.deleteOne(this.channelId, this.id, reason)

    if (result) {
      this.deleted = true
      return this
    }

    return undefined
  }

  async edit(content: MessageContent, options?: MessageCreateOptions): Promise<Message | undefined> {
    return await this.app.messages.edit(this.channelId, this.id, content, options)
  }

  get createdDate(): Date {
    return new Date(this.createdTimestamp)
  }

  get editedDate(): Date | undefined {
    return this.editedTimestamp ? new Date(this.editedTimestamp) : undefined
  }

  author(options?: CacheManagerGetOptions): Promise<User | undefined> {
    return this.app.users.cache.get(this.authorId, options)
  }

  async guild(options?: CacheManagerGetOptions): Promise<Guild | undefined> {
    return this.guildId ? this.app.guilds.cache.get(this.guildId, options) : undefined
  }

  async channel(options?: CacheManagerGetOptions): Promise<AnyWritableChannel | undefined> {
    return this.app.channels.cache.get(this.channelId, {
      ...options,
      storage: this.guildId ?? 'dm'
    })
  }

  async member(options?: CacheManagerGetOptions): Promise<GuildMember | undefined> {
    return this.guildId
      ? this.app.internals.cache.get(Keyspaces.GuildMembers, this.guildId, 'GuildMember', this.authorId, options)
      : undefined
  }

  async reference(options?: CacheManagerGetOptions): Promise<Message | undefined> {
    return this.referencedMessageId
      ? this.app.internals.cache.get(Keyspaces.Messages, this.channelId, 'Message', this.referencedMessageId, options)
      : undefined
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      channelId: true,
      authorId: true,
      guildId: true,
      content: true,
      deleted: true,
      id: true,
      nonce: true,
      pinned: true,
      tts: true,
      type: true,
      webhookId: true,
      createdTimestamp: true,
      editedTimestamp: true,
      embeds: true,
      flags: true,
      referencedMessageId: true,
    }, obj)
  }
}
