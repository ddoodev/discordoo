import { ChannelTypes } from '../../src/constants'
import { Entities } from '../../src/api/entities/Entities'

type EntityKeys = keyof typeof Entities

export function channelEntityKey(data: any): EntityKeys {
  switch (data?.type as ChannelTypes) {
    case ChannelTypes.Dm:
    case ChannelTypes.GroupDm:
      return 'DirectMessagesChannel'
    case ChannelTypes.GuildCategory:
      return 'GuildCategoryChannel'
    case ChannelTypes.GuildNews:
      return 'GuildNewsChannel'
    case ChannelTypes.GuildNewsThread:
      return 'GuildNewsThreadChannel'
    case ChannelTypes.GuildPrivateThread:
    case ChannelTypes.GuildPublicThread:
      return 'GuildThreadChannel'
    case ChannelTypes.GuildStageVoice: // GuildStageVoiceChannel
    case ChannelTypes.GuildStore: // GuildStoreChannel
      return 'AbstractChannel'
    case ChannelTypes.GuildText:
      return 'GuildTextChannel'
    case ChannelTypes.GuildVoice: // GuildVoiceChannel
    default: // AbstractChannel
      return 'AbstractChannel'
  }
}

export function reactionEmojiEntityKey(data: any): EntityKeys {
  if (data.id) return 'GuildEmoji'
  return 'ReactionEmoji'
}

export function emojiEntityKey(data: any): EntityKeys {
  if (data?.reactionMessageId) {
    return 'ReactionEmoji'
  }

  if (data.roles) {
    return 'GuildEmoji'
  }

  if (data.id) {
    return 'GuildPreviewEmoji'
  }

  return data.name ? 'ActivityEmoji' : 'AbstractEmoji'
}