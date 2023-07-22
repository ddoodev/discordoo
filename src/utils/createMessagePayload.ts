import {
  resolveActionRowToRaw, resolveAllowedMentionsToRaw,
  resolveEmbedToRaw,
  resolveFile,
  resolveFiles,
  resolveMessageReferenceToRaw,
  resolveStickerId
} from '@src/utils/resolve'
import { DiscordooError } from '@src/utils/DiscordooError'
import { inspect } from 'util'
import { MessageContent, MessageCreateData, MessageCreateOptions, MessageEmbedBuilder, StickerResolvable } from '@src/api'
import { MessageEmbedTypes, StickerFormatTypes } from '@src/constants'
import { filterAndMap } from '@src/utils/filterAndMap'
import { DataResolver } from '@src/utils/DataResolver'
import { InteractionMessageContent } from '@src/api/entities/message/interfaces/MessageContent'
import { InteractionMessageCreateOptions } from '@src/api/entities/message/interfaces/MessageCreateOptions'
import { InteractionMessageCreateData } from '@src/api/entities/message/interfaces/MessageCreateData'

export async function createMessagePayload<Interaction extends boolean = false>(
  content: Interaction extends true ? InteractionMessageContent : MessageContent = '',
  options: Interaction extends true ? InteractionMessageCreateOptions : MessageCreateOptions = {}
): Promise<Interaction extends true ? InteractionMessageCreateData : MessageCreateData> {
  let contentResolved = false

  if (!content) {
    if (
      !options.file && !options.embed && !('sticker' in options) && !options.content &&
      !options.files?.length && !options.embeds?.length && !('stickers' in options && options.stickers?.length)
    ) {
      throw new DiscordooError(
        'MessagesManager#create',
        'Incorrect content:', inspect(content) + '.',
        'If content not specified, options must be provided: at least one of options.embed(s)/file(s)/sticker(s)/content.')
    } else {
      contentResolved = true
    }
  }

  const data: any /* MessageContent */ = content

  const payload: MessageCreateData = {
    content: '',
    allowed_mentions: undefined,
    message_reference: undefined,
    tts: false,
    embeds: [],
    attachments: undefined,
    stickers: [],
    components: [],
    flags: undefined,
  }

  const embedTypes = Object.values<any>(MessageEmbedTypes).filter(v => typeof v === 'string'),
    stickerFormatTypes = Object.values<any>(StickerFormatTypes).filter(v => typeof v === 'number')

  if (Array.isArray(data)) {
    const target: /* MessageEmbedResolvable | StickerResolvable | MessageAttachmentResolvable */ any = content[0]

    if (embedTypes.includes(target.type) || target instanceof MessageEmbedBuilder) { // content = embeds
      payload.embeds.push(...data.map(resolveEmbedToRaw))

    } else if (stickerFormatTypes.includes(target.formatType ?? target.format_type)) { // content = stickers
      const stickers = filterAndMap<StickerResolvable, string>(
        data,
        (s) => resolveStickerId(s) !== undefined,
        (s) => resolveStickerId(s)
      )

      payload.stickers.push(...stickers)

    } else { // content = files or unexpected things
      try {
        payload.attachments = []
        payload.attachments.push(...await resolveFiles(data))
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

    contentResolved = true
  }

  if (!contentResolved) {
    if (embedTypes.includes(data.type) || data instanceof MessageEmbedBuilder) { // content = embed
      payload.embeds.push(resolveEmbedToRaw(data))

    } else if (stickerFormatTypes.includes(data.formatType ?? data.format_type)) {
      const id = resolveStickerId(data)
      if (id) payload.stickers.push(id)

    } else if (typeof data === 'object' && DataResolver.isMessageAttachmentResolvable(data)) {
      payload.attachments = []
      payload.attachments.push(await resolveFile(data))

    } else {
      payload.content = content.toString()
    }
  }

  payload.tts = !!options.tts

  if (options.content) payload.content = options.content

  if ('messageReference' in options && options.messageReference) {
    payload.message_reference = resolveMessageReferenceToRaw(options.messageReference)
  }

  if (options.allowedMentions) payload.allowed_mentions = resolveAllowedMentionsToRaw(options.allowedMentions)

  if (options.component) payload.components.push(resolveActionRowToRaw(options.component))
  if (options.components?.length) payload.components.push(...options.components.map(resolveActionRowToRaw))

  if (options.embed) payload.embeds.push(resolveEmbedToRaw(options.embed))
  if (options.embeds?.length) payload.embeds.push(...options.embeds.map(resolveEmbedToRaw))

  if (options.file || options.files) {
    payload.attachments = []
  }

  if (options.file) payload.attachments!.push(await resolveFile(options.file))
  if (options.files?.length) payload.attachments!.push(...await resolveFiles(options.files))

  if ('sticker' in options) {
    const id = resolveStickerId(data.sticker)
    if (id) payload.stickers.push(id)
  }
  if ('stickers' in options && options.stickers?.length) {
    const stickers = filterAndMap<StickerResolvable, string>(
      options.stickers,
      (s) => resolveStickerId(s) !== undefined,
      (s) => resolveStickerId(s)
    )

    payload.stickers.push(...stickers)
  }

  if (options.flags) payload.flags = options.flags as any

  // console.log('PAYLOAD', payload)
  return payload
}
