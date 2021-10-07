import { RawMessageEmbedData } from '@src/api/entities/embed'
import { RawAttachment } from '@discordoo/providers'

export interface MessageCreateData {
  content?: string
  tts: boolean
  embeds: RawMessageEmbedData[]
  files: RawAttachment[]
  allowed_mentions: any // TODO: RawAllowedMentionsData
  message_reference: any // TODO: RawMessageReferenceData
  components: any[] // TODO: RawMessageComponentData[]
  stickers: string[]
}
