import {
  GuildNewsChannel,
  GuildStoreChannel,
  GuildTextChannel
} from '@src/api'

export type AnyInvitableChannel =
  // TODO add dm group channel
  GuildNewsChannel
  // | GuildStageVoiceChannel
  | GuildStoreChannel
  | GuildTextChannel
  // | GuildVoiceChannel
