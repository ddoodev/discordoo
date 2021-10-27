import { RawUserData } from '@src/api/entities/user/interfaces/RawUserData'
import { RawMessageAttachmentData } from '@src/api/entities/attachment/interfaces'
import { RawMessageEmbedData } from '@src/api/entities/embed'
import { MessageTypes } from '@src/constants/entities/message/MessageTypes'
import { RawGuildMemberData } from '@src/api'

export interface RawMessageData {
  id: string
  channel_id: string
  author?: RawUserData
  member?: RawGuildMemberData
  content?: string
  timestamp: number
  edited_timestamp?: number
  tts: boolean
  attachments: RawMessageAttachmentData[]
  embeds: RawMessageEmbedData[]
  reactions?: any[] // TODO: RawMessageReactionData[]
  nonce?: string | number
  pinned: boolean
  webhook_id?: string
  type: MessageTypes
}
