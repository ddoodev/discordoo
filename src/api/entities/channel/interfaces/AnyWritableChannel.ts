import {
  DirectMessagesChannel,
  GuildNewsChannel,
  GuildNewsThreadChannel,
  GuildTextChannel,
  GuildThreadChannel
} from '../../../../../src/api'

export type AnyWritableChannel =
  GuildTextChannel |
  DirectMessagesChannel |
  GuildNewsChannel |
  GuildNewsThreadChannel |
  GuildThreadChannel