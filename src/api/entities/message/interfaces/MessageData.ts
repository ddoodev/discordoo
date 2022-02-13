import {
  BitFieldResolvable,
  GuildMemberData, MessageAttachmentResolvable, MessageEmbedResolvable,
  RoleResolvable,
  UserData
} from '@src/api'
import { MessageTypes } from '@src/constants'
import { ChannelMentionData } from '@src/api/entities/message/interfaces/ChannelMentionData'
import { MessageReactionResolvable } from '@src/api/entities/reaction/interfaces/MessageReactionResolvable'

export interface MessageData {
  id: string
  channelId: string
  guildId?: string
  authorId: string
  content?: string
  timestamp: string
  editedTimestamp?: string
  tts: boolean
  mentionEveryone: boolean
  mentions: Array<UserData & { member: GuildMemberData }>
  mentionRoles: RoleResolvable[]
  mentionChannels: ChannelMentionData[]
  attachments: MessageAttachmentResolvable[]
  embeds: MessageEmbedResolvable[]
  reactions?: MessageReactionResolvable[]
  nonce?: string | number
  pinned: boolean
  webhookId?: string
  deleted?: boolean
  type: MessageTypes
  // TODO activity: MessageActivityData
  // TODO application: ApplicationData
  // TODO applicationId: string
  // TODO messageReference: MessageReferenceData
  flags: BitFieldResolvable
  referencedMessageId?: string
  // TODO interaction: MessageInteractionData
  // TODO thread: ThreadChannelData
  // TODO components: MessageComponentData[]
  // TODO sticker_items: MessageStickerItemData[]
}
