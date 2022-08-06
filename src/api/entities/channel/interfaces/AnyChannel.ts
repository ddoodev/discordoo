import {
  DirectMessagesChannel,
  GuildCategoryChannel,
  GuildNewsChannel,
  GuildNewsThreadChannel,
  GuildStoreChannel,
  GuildTextChannel,
  GuildThreadChannel
} from '@src/api'

export type AnyChannel = DirectMessagesChannel |
  GuildCategoryChannel |
  GuildNewsChannel |
  GuildNewsThreadChannel |
  // GuildStageVoiceChannel |
  GuildStoreChannel |
  GuildTextChannel |
  GuildThreadChannel // |
  // GuildVoiceChannel
