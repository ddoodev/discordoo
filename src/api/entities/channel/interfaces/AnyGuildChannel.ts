import {
  GuildCategoryChannel,
  GuildNewsChannel,
  GuildNewsThreadChannel, GuildStoreChannel,
  GuildTextChannel, GuildThreadChannel
} from '@src/api'

export type AnyGuildChannel = GuildTextChannel |
  GuildNewsChannel |
  GuildNewsThreadChannel |
  GuildStoreChannel |
  GuildThreadChannel |
  GuildCategoryChannel
