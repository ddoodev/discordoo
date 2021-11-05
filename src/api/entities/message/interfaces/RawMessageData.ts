import { RawUserData } from '@src/api/entities/user/interfaces/RawUserData'
import { RawMessageAttachmentData } from '@src/api/entities/attachment/interfaces'
import { RawMessageEmbedData } from '@src/api/entities/embed'
import { MessageTypes } from '@src/constants/entities/message/MessageTypes'
import { RawGuildMemberData } from '@src/api'
import { RawChannelMentionData } from '@src/api/entities/message/interfaces/RawChannelMentionData'
import { MessageReactionData } from '@src/api/entities/reaction/interfaces/MessageReactionData'

export interface RawMessageData {
  id: string
  channel_id: string
  guild_id?: string
  author: RawUserData
  member?: RawGuildMemberData
  content?: string
  timestamp: string
  edited_timestamp?: string
  tts: boolean
  mention_everyone: boolean
  mentions: Array<RawUserData & { member: RawGuildMemberData }>
  mention_roles: string[]
  mention_channels: RawChannelMentionData[]
  attachments: RawMessageAttachmentData[]
  embeds: RawMessageEmbedData[]
  reactions?: MessageReactionData[]
  nonce?: string | number
  pinned: boolean
  webhook_id?: string
  type: MessageTypes
  // TODO activity: RawMessageActivityData
  // TODO application: RawApplicationData
  // TODO application_id: string
  // TODO message_reference: RawMessageReferenceData
  flags: number
  referenced_message?: RawMessageData
  // TODO interaction: RawMessageInteractionData
  // TODO thread: RawThreadChannelData
  // TODO components: RawMessageComponentData[]
  // TODO sticker_items: RawMessageStickerItemData[]
}
