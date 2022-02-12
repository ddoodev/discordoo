import {
  DirectMessagesChannel,
  GuildNewsChannel,
  GuildNewsThreadChannel,
  GuildStoreChannel,
  GuildTextChannel,
  GuildThreadChannel
} from '@src/api'

export type AnyWritableChannel =
  GuildTextChannel |
  DirectMessagesChannel |
  GuildNewsChannel |
  GuildNewsThreadChannel |
  GuildStoreChannel |
  GuildThreadChannel