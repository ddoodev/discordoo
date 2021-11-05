import { ChannelTypes } from '@src/constants'
import { Entities } from '@src/api/entities/Entities'

type EntitiesKeys = keyof typeof Entities

export function channelEntityKey(data: any): EntitiesKeys {
  switch (data?.type as ChannelTypes) {
    case ChannelTypes.DM:
    case ChannelTypes.GROUP_DM: // DirectMessagesChannel
      return 'DirectMessagesChannel'
    case ChannelTypes.GUILD_CATEGORY: // GuildCategoryChannel
      return 'GuildCategoryChannel'
    case ChannelTypes.GUILD_NEWS: // GuildNewsChannel
    case ChannelTypes.GUILD_NEWS_THREAD: // GuildNewsThreadChannel
    case ChannelTypes.GUILD_PRIVATE_THREAD:
    case ChannelTypes.GUILD_PUBLIC_THREAD: // GuildThreadChannel
    case ChannelTypes.GUILD_STAGE_VOICE: // GuildStageVoiceChannel
    case ChannelTypes.GUILD_STORE: // GuildStoreChannel
      return 'AbstractGuildChannel'
    case ChannelTypes.GUILD_TEXT: // GuildTextChannel
      return 'GuildTextChannel'
    case ChannelTypes.GUILD_VOICE: // GuildVoiceChannel
    default: // AbstractChannel
      return 'AbstractChannel'
  }
}

export function reactionEmojiEntityKey(data: any): EntitiesKeys {
  if (data.id) return 'GuildEmoji'
  return 'ReactionEmoji'
}
