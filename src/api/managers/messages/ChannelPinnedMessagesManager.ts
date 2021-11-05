import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { EntitiesCacheManager, Message, MessageResolvable, MessagesManagerData } from '@src/api'
import { Client } from '@src/core'
import { DiscordooError, resolveChannelId } from '@src/utils'
import { Keyspaces } from '@src/constants'

export class ChannelPinnedMessagesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Message>
  public channelId: string
  public lastPinTimestamp?: number

  constructor(client: Client, data: MessagesManagerData) {
    super(client)

    const id = resolveChannelId(data.channel)
    if (!id) throw new DiscordooError('ChannelPinnedMessagesManager', 'Cannot operate without channel id.')
    this.channelId = id

    this.lastPinTimestamp = data.lastPinTimestamp

    this.cache = new EntitiesCacheManager<Message>(this.client, {
      keyspace: Keyspaces.PINNED_MESSAGES,
      storage: this.channelId,
      entity: 'Message',
      policy: 'messages'
    })
  }

  get lastPinDate(): Date | undefined {
    return this.lastPinTimestamp ? new Date(this.lastPinTimestamp) : undefined
  }

  add(message: MessageResolvable, reason?: string) {
    return this.client.messages.pin(this.channelId, message, reason)
  }

  remove(message: MessageResolvable, reason?: string) {
    return this.client.messages.unpin(this.channelId, message, reason)
  }

  fetch() {
    return this.client.messages.fetchPinned(this.channelId)
  }

}
