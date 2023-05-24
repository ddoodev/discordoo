import { RawMessageEmbedData } from '@src/api'
import { RawAttachment } from '@discordoo/providers'

export interface MessageEditData {
  content?: string
  embeds: RawMessageEmbedData[]
  files: RawAttachment[]
  allowed_mentions: any // TODO: RawAllowedMentionsData
  components: any[] // TODO: RawMessageComponentData[]
  flags?: 4 // only MessageFlags.SuppressEmbeds can be set
}