import { AbstractGuildTextChannel } from '@src/api/entities/channel/AbstractGuildTextChannel'
import { GuildTextChannel } from '@src/api/entities/channel/GuildTextChannel'
import { DirectMessagesChannel } from '@src/api/entities/channel/DirectMessagesChannel'

export type AnyWritableChannel = AbstractGuildTextChannel | GuildTextChannel | DirectMessagesChannel
