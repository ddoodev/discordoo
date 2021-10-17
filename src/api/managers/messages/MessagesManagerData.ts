import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'

export interface MessagesManagerData {
  channel?: AbstractChannel
  channelId: string
}
