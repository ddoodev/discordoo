import { AbstractEvent } from '@src/events'
import { EventNames, Keyspaces } from '@src/constants'
import { RawAbstractThreadChannelData } from '@src/api/entities/channel/interfaces/RawAbstractThreadChannelData'
import { channelEntityKey } from '@src/utils'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { AnyThreadChannel } from '@src/api/entities/channel/interfaces/AnyThreadChannel'
import { ThreadCreateEventContext } from '@src/events/thread/ctx/ThreadCreateEventContext'
import { ThreadMember } from '@src/api/entities/member/ThreadMember'

export class ThreadCreateEvent extends AbstractEvent {
  public name = EventNames.THREAD_CREATE

  async execute(shardId: number, data: RawAbstractThreadChannelData) {
    const entityKey = channelEntityKey(data)
    if (entityKey === 'AbstractChannel') {
      // TODO: log about unknown channel
      return
    }

    const Channel: any = EntitiesUtil.get(entityKey)

    const channel: AnyThreadChannel = await new Channel(this.client).init(data)

    await this.client.channels.cache.set(channel.id, channel, { storage: channel.guildId })

    if (data.member) {
      let member = await this.client.internals.cache.get<string, ThreadMember>(
        Keyspaces.THREAD_MEMBERS,
        channel.id,
        'ThreadMember',
        data.member.user_id
      )

      if (member) {
        member = await member.init(data.member)
      } else {
        const ThreadMember = EntitiesUtil.get('ThreadMember')
        member = await new ThreadMember(this.client).init(data.member)
      }

      await this.client.threadMembers.cache.set(member.userId, member, { storage: channel.id })
    }

    const context: ThreadCreateEventContext = {
      shardId,
      thread: channel,
      threadId: channel.id,
      guildId: channel.guildId,
    }

    this.client.emit(EventNames.THREAD_CREATE, context)
  }
}