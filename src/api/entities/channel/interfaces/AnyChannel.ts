import { AbstractChannel } from '@src/api'
import { AbstractGuildChannel } from '@src/api/entities/channel/AbstractGuildChannel'
import { AbstractThreadChannel } from '@src/api/entities/channel/AbstractThreadChannel'

export type AnyChannel = AbstractChannel | AbstractGuildChannel | AbstractThreadChannel
