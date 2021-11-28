import { ChannelTypes } from '@src/constants'
import { Entities } from '@src/api/entities/Entities'

type EntityKeys = keyof typeof Entities

export function channelEntityKey(data: any): EntityKeys {
  switch (data?.type as ChannelTypes) {
    case ChannelTypes.DM:
    case ChannelTypes.GROUP_DM:
      return 'DirectMessagesChannel'
    case ChannelTypes.GUILD_CATEGORY:
      return 'GuildCategoryChannel'
    case ChannelTypes.GUILD_NEWS:
      return 'GuildNewsChannel'
    case ChannelTypes.GUILD_NEWS_THREAD:
      return 'GuildNewsThreadChannel'
    case ChannelTypes.GUILD_PRIVATE_THREAD:
    case ChannelTypes.GUILD_PUBLIC_THREAD:
      return 'GuildThreadChannel'
    case ChannelTypes.GUILD_STAGE_VOICE: // GuildStageVoiceChannel
    case ChannelTypes.GUILD_STORE: // GuildStoreChannel
      return 'AbstractChannel'
    case ChannelTypes.GUILD_TEXT:
      return 'GuildTextChannel'
    case ChannelTypes.GUILD_VOICE: // GuildVoiceChannel
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