import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { EntitiesCacheManager, Message, MessageResolvable, MessagesManagerData } from '@src/api'
import { DiscordooError, resolveChannelId } from '@src/utils'
import { Keyspaces } from '@src/constants'
import { RestEligibleDiscordApplication } from '@src/core/apps/AnyDiscordApplication'

export class ChannelPinnedMessagesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Message>
  public channelId: string
  public lastPinTimestamp?: number

  constructor(app: RestEligibleDiscordApplication, data: MessagesManagerData) {
    super(app)

    const id = resolveChannelId(data.channel)
    if (!id) throw new DiscordooError('ChannelPinnedMessagesManager', 'Cannot operate without channel id.')
    this.channelId = id

    this.lastPinTimestamp = data.lastPinTimestamp

    this.cache = new EntitiesCacheManager<Message>(this.app, {
      keyspace: Keyspaces.PinnedMessages,
      storage: this.channelId,
      entity: 'Message',
      policy: 'messages'
    })
  }

  get lastPinDate(): Date | undefined {
    return this.lastPinTimestamp ? new Date(this.lastPinTimestamp) : undefined
  }

  add(message: MessageResolvable, reason?: string) {
    return this.app.messages.pin(this.channelId, message, reason)
  }

  remove(message: MessageResolvable, reason?: string) {
    return this.app.messages.unpin(this.channelId, message, reason)
  }

  fetch() {
    return this.app.messages.fetchPinned(this.channelId)
  }

}
