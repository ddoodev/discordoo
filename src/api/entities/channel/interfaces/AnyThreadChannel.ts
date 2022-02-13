import { AbstractThreadChannel, GuildNewsThreadChannel, GuildThreadChannel } from '@src/api'

export type AnyThreadChannel = AbstractThreadChannel | GuildNewsThreadChannel | GuildThreadChannel
