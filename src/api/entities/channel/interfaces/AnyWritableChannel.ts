import {
  AbstractGuildTextChannel,
  DirectMessagesChannel,
  GuildNewsChannel,
  GuildNewsThreadChannel,
  GuildStoreChannel,
  GuildTextChannel,
  GuildThreadChannel
} from '@src/api'

export type AnyWritableChannel =
  AbstractGuildTextChannel |
  GuildTextChannel |
  DirectMessagesChannel |
  // GuildNewsChannel |
  // GuildNewsThreadChannel |
  // GuildStoreChannel |
  GuildThreadChannel