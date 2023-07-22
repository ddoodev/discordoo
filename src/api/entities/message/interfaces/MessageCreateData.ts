import { RawMessageEmbedData } from '@src/api/entities/embed'
import { RawAttachment } from '@discordoo/providers'
import { RawActionRowData, RawAllowedMentionsData } from '@src/api'

export interface MessageCreateData {
  content?: string
  tts: boolean
  embeds: RawMessageEmbedData[]
  attachments?: RawAttachment[]
  allowed_mentions?: RawAllowedMentionsData
  message_reference: any // TODO: RawMessageReferenceData
  components: RawActionRowData[]
  stickers: string[]
  flags?: 4 // only MessageFlags.SuppressEmbeds can be set
}

export interface WebhookMessageCreateData extends MessageCreateData {
  /** Override the default username of the webhook */
  username?: string
  /** Override the default avatar of the webhook */
  avatar_url?: string
  /** Name of thread to create (requires the webhook channel to be a forum channel) */
  thread_name?: string
}

export interface InteractionMessageCreateData extends Omit<MessageCreateData, 'message_reference' | 'stickers' | 'flags'> {
  flags?: 4 | 64 | 68 // only MessageFlags.SuppressEmbeds and MessageFlags.Ephemeral can be set
}
