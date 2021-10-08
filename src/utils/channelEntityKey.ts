import { ChannelTypes } from '@src/constants'
import { Entities } from '@src/api'

export function channelEntityKey(data: any): keyof typeof Entities {
  switch (data.type as ChannelTypes) {
    case ChannelTypes.DM:
    case ChannelTypes.GROUP_DM: // DirectMessagesChannel
    case ChannelTypes.GUILD_CATEGORY: // GuildCategoryChannel
    case ChannelTypes.GUILD_NEWS: // GuildNewsChannel
    case ChannelTypes.GUILD_NEWS_THREAD: // GuildNewsThreadChannel
    case ChannelTypes.GUILD_PRIVATE_THREAD:
    case ChannelTypes.GUILD_PUBLIC_THREAD: // GuildThreadChannel
    case ChannelTypes.GUILD_STAGE_VOICE: // GuildStageVoiceChannel
    case ChannelTypes.GUILD_STORE: // GuildStoreChannel
    case ChannelTypes.GUILD_TEXT: // GuildTextChannel
    case ChannelTypes.GUILD_VOICE: // GuildVoiceChannel
    default: // AbstractChannel
      return 'AbstractChannel'
  }
}
