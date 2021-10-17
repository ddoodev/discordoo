import { EntitiesCacheManager, EntitiesUtil, Message } from '@src/api'
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
import { StickerResolvable } from '@src/api/entities/sticker'
import { MessageEmbedTypes, StickerFormatTypes } from '@src/constants'
import { DiscordooError } from '@src/utils'
import { DataResolver } from '@src/utils/DataResolver'
import { inspect } from 'util'
import { filterAndMap } from '@src/utils/filterAndMap'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'

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

  async create(channel: ChannelResolvable, content: MessageContent = '', options: SendOptions = {}): Promise<Message | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) throw new DiscordooError('ClientMessagesManager#create', 'Cannot create message without channel id.')

    let contentProvidedFromOptions = false

    if (typeof channelId !== 'string'!) throw new DiscordooError('MessagesManager#create', 'Incorrect channel id:', channelId)
    if (!content) {
      if (
        !options.file && !options.embed && !options.sticker && !options.content &&
        !options.files?.length && !options.embeds?.length && !options.stickers?.length
      ) {
        throw new DiscordooError(
          'MessagesManager#create',
          'Incorrect content:', inspect(content) + '.',
          'If content not specified, options must be provided: at least one of options.embeds/embed/files/file/stickers/sticker.')
      } else {
        contentProvidedFromOptions = true
      }
    }

    const data: any /* MessageContent */ = content

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

    const embedTypes = Object.values<any>(MessageEmbedTypes).filter(v => typeof v === 'string'),
      stickerFormatTypes = Object.values<any>(StickerFormatTypes).filter(v => typeof v === 'number')

    if (Array.isArray(data)) {
      const target: /* MessageEmbedResolvable | StickerResolvable | MessageAttachmentResolvable */ any = content[0]

      if (embedTypes.includes(target.type)) { // content = embeds
        payload.embeds.push(...data.map(resolveEmbed))

      } else if (stickerFormatTypes.includes(target.formatType ?? target.format_type)) { // content = stickers
        const stickers = filterAndMap<StickerResolvable, string>(
          data,
          (s) => resolveStickerId(s) !== undefined,
          (s) => resolveStickerId(s)
        )

        payload.stickers.push(...stickers)

      } else { // content = files or unexpected things
        try {
          payload.files.push(...await resolveFiles(data))
        } catch (e: any) {
          throw new DiscordooError(
            'MessagesManager#create',
            'Tried to resolve array of attachments as message content, but got', (e.name ?? 'Error'),
            'with message:', (e.message ?? 'unknown error') + '.',
            'Check if you are pass the message content array correctly. Do not mix content types in this array.',
            'Allowed types is MessageEmbedResolvable, StickerResolvable, MessageAttachmentResolvable.',
            'If you pass anything other than these types to the message content array, you will get this error.'
          )
        }
      }
    }

    if (!contentProvidedFromOptions) {
      if (embedTypes.includes(data.type)) {
        payload.embeds.push(resolveEmbed(data))

      } else if (stickerFormatTypes.includes(data.formatType ?? data.format_type)) {
        const id = resolveStickerId(data)
        if (id) payload.stickers.push(id)

      } else if (typeof data === 'object' && DataResolver.isMessageAttachmentResolvable(data)) {
        payload.files.push(await resolveFile(data))

      } else {
        payload.content = content.toString()
      }
    }

    payload.tts = !!options.tts

    if (options.content) payload.content = options.content

    if (options.messageReference) {
      const { guild, channel, message, guild_id, channel_id, message_id } = options.messageReference

      payload.message_reference = {
        guild_id: guild_id ?? resolveGuildId(guild),
        channel_id: channel_id ?? resolveChannelId(channel),
        message_id: message_id ?? resolveMessageId(message)
      }
    }

    // TODO: allowed mentions
    // TODO: components

    if (options.embed) payload.embeds.push(resolveEmbed(options.embed))
    if (options.embeds?.length) payload.embeds.push(...options.embeds.map(resolveEmbed))

    if (options.file) payload.files.push(await resolveFile(options.file))
    if (options.files?.length) payload.files.push(...await resolveFiles(options.files))

    if (options.sticker) {
      const id = resolveStickerId(data.stickers)
      if (id) payload.stickers.push(id)
    }
    if (options.stickers?.length) {
      const stickers = filterAndMap<StickerResolvable, string>(
        options.stickers,
        (s) => resolveStickerId(s) !== undefined,
        (s) => resolveStickerId(s)
      )

      payload.stickers.push(...stickers)
    }

    const Message = EntitiesUtil.get('Message')

    const response = await this.client.internals.actions.createMessage(channelId, payload)
    if (response.success) {
      const msg = new Message(this.client)
      return msg.init(response.result)
    }
  }
}
