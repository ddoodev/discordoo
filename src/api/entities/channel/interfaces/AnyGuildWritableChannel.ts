import {
  DirectMessagesChannel,
  GuildNewsChannel,
  GuildNewsThreadChannel,
  GuildStoreChannel,
  GuildTextChannel,
  GuildThreadChannel
} from '@src/api'

export type AnyGuildWritableChannel = GuildTextChannel |
  DirectMessagesChannel |
  GuildNewsChannel |
  GuildNewsThreadChannel |
  GuildStoreChannel |
  GuildThreadChannel