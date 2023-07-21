import {
  BitFieldResolvable,
  GuildMemberData,
  MessageAttachmentResolvable,
  MessageComponentResolvable,
  MessageEmbedResolvable,
  MessageInteractionResolvable,
  MessageReferenceResolvable,
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
  messageReference?: MessageReferenceResolvable
  flags: BitFieldResolvable
  referencedMessageId?: string
  interaction: MessageInteractionResolvable
  // TODO thread: ThreadChannelData
  components: MessageComponentResolvable[]
  // TODO sticker_items: MessageStickerItemData[]
}
