import { EntitiesCacheManager, EntitiesManager, EntitiesUtil, Message } from '@src/api'
import { Client } from '@src/core'
import { ChannelResolvable } from '@src/api/entities/channel/interfaces/ChannelResolvable'
import { MessageContent } from '@src/api/entities/message/interfaces/MessageContent'
import { SendOptions } from '@src/api/entities/message/interfaces/SendOptions'
import {
  resolveChannelId,
  resolveEmbed,
  resolveFile,
  resolveFiles,
  resolveGuildId,
  resolveMessageId,
  resolveStickerId
} from '@src/utils/resolve'
import { MessageCreateData } from '@src/api/entities/message/interfaces/MessageCreateData'
import { MessageEmbed } from '@src/api/entities/embed'
import { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'
import { MessageSticker } from '@src/api/entities/sticker'

export class ClientMessagesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Message>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<Message>(this.client, {
      keyspace: 'messages',
      storage: 'global',
      entity: 'Message',
      policy: 'messages'
    })
  }

  async create(channel: ChannelResolvable, content: MessageContent, options: SendOptions = {}): Promise<Message | undefined> {
    const channelId = resolveChannelId(channel)

    const payload: MessageCreateData = {
      content: undefined,
      allowed_mentions: undefined,
      message_reference: undefined,
      tts: false,
      embeds: [],
      files: [],
      stickers: [],
      components: [],
    }

    if (content instanceof MessageEmbed) payload.embeds.push(content.toJson())
    else if (content instanceof MessageAttachment) payload.files.push(await content.toRaw())
    else if (content instanceof MessageSticker) payload.stickers.push(content.id)
    else if (Buffer.isBuffer(content)) payload.files.push({ data: content, name: 'attachment', ephemeral: false })
    else payload.content = content.toString()

    payload.tts = !!options.tts

    if (options.content) payload.content = options.content

    if (options.messageReference) {
      const { referenceGuild, referenceChannel, referenceMessage, guild_id, channel_id, message_id } = options.messageReference

      payload.message_reference = {
        guild_id: guild_id ?? resolveGuildId(referenceGuild),
        channel_id: channel_id ?? resolveChannelId(referenceChannel),
        message_id: message_id ?? resolveMessageId(referenceMessage)
      }
    }

    // TODO: allowed mentions
    // TODO: components

    if (options.embed) payload.embeds.push(resolveEmbed(options.embed))
    if (options.embeds?.length) payload.embeds.push(...options.embeds.map(resolveEmbed))

    if (options.file) payload.files.push(await resolveFile(options.file))
    if (options.files?.length) payload.files.push(...await resolveFiles(options.files))

    if (options.sticker) payload.stickers.push(resolveStickerId(options.sticker))
    if (options.stickers?.length) payload.stickers.push(...options.stickers.map(resolveStickerId))

    const Message = EntitiesUtil.get('Message')

    const response = await this.client.internals.actions.createMessage(channelId, payload)
    if (response.success) {
      const msg = new Message(this.client)
      return msg.init(response.result)
    }
  }
}
