import { AbstractEvent, AbstractEventContext } from '@src/events'
import { EventNames, Keyspaces } from '@src/constants'
import { RawAbstractThreadChannelData } from '@src/api/entities/channel/interfaces/RawAbstractThreadChannelData'
import { channelEntityKey } from '@src/utils'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { ThreadDeleteEventContext } from '@src/events/thread/ctx/ThreadDeleteEventContext'

export class ThreadDeleteEvent extends AbstractEvent<ThreadDeleteEventContext | AbstractEventContext> {
  public name = EventNames.THREAD_DELETE

  async execute(shardId: number, data: RawAbstractThreadChannelData) {

    const entityKey = channelEntityKey(data)
    if (entityKey === 'AbstractChannel') {
      // TODO: log about unknown channel
      return {
        shardId,
      }
    }

    const Channel: any = EntitiesUtil.get(entityKey)

    let thread = await this.app.internals.cache.get(
      Keyspaces.Channels,
      data.guild_id,
      'channelEntityKey',
      data.id,
    )

    if (thread) {
      thread = await thread.init(data)
    } else {
      thread = await new Channel(this.app).init(data)
    }

    // remove thread from cache
    await this.app.internals.cache.delete(
      Keyspaces.Channels,
      data.guild_id,
      data.id
    )

    // clear thread members from cache
    await this.app.internals.cache.clear(
      Keyspaces.ThreadMembers,
      data.id
    )

    const context: ThreadDeleteEventContext = {
      shardId,
      thread,
      threadId: data.id,
      threadParentId: data.parent_id!, // https://discord.com/developers/docs/topics/gateway#thread-delete
      guildId: data.guild_id,
    }

    this.app.emit(EventNames.THREAD_DELETE, context)
    return context
  }
}