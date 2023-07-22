import {
  GuildNewsChannel,
  GuildNewsThreadChannel,
  GuildStoreChannel,
  GuildTextChannel,
  GuildThreadChannel
} from '../../../../../src/api'

export type AnyGuildWritableChannel = GuildTextChannel |
  GuildNewsChannel |
  GuildNewsThreadChannel |
  GuildStoreChannel |
  GuildThreadChannel