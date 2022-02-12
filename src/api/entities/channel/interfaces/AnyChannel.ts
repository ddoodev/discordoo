import {
  AbstractGuildTextChannel,
  DirectMessagesChannel,
  GuildCategoryChannel,
  GuildNewsChannel,
  GuildNewsThreadChannel,
  GuildStoreChannel,
  GuildTextChannel,
  GuildThreadChannel
} from '@src/api'

export type AnyChannel =
  AbstractGuildTextChannel |
  DirectMessagesChannel |
  GuildCategoryChannel |
  GuildNewsChannel |
  GuildNewsThreadChannel |
  // GuildStageVoiceChannel |
  GuildStoreChannel |
  GuildTextChannel |
  GuildThreadChannel // |
  // GuildVoiceChannel
