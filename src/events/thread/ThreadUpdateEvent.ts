import { AbstractEvent, AbstractEventContext } from '../../../src/events'
import { EventNames, Keyspaces } from '../../../src/constants'
import { RawAbstractThreadChannelData } from '../../../src/api/entities/channel/interfaces/RawAbstractThreadChannelData'
import { channelEntityKey } from '../../../src/utils'
import { EntitiesUtil } from '../../../src/api/entities/EntitiesUtil'
import { AnyThreadChannel } from '../../../src/api/entities/channel/interfaces/AnyThreadChannel'
import { ThreadUpdateEventContext } from '../../../src/events/thread/ctx/ThreadUpdateEventContext'
import { ThreadMember } from '../../../src/api/entities/member/ThreadMember'

export class ThreadUpdateEvent extends AbstractEvent<ThreadUpdateEventContext | AbstractEventContext> {
  public name = EventNames.THREAD_UPDATE

  async execute(shardId: number, data: RawAbstractThreadChannelData) {

    const entityKey = channelEntityKey(data)
    if (entityKey === 'AbstractChannel') {
      // TODO: log about unknown channel
      return {
        shardId,
      }
    }

    const Channel: any = EntitiesUtil.get(entityKey)

    const stored = await this.app.internals.cache.get<string, AnyThreadChannel>(
      Keyspaces.Channels,
      data.guild_id,
      'channelEntityKey',
      data.id
    )

    const updated = stored ? await (await stored._clone()).init(data) : await new Channel(this.app).init(data)

    await this.app.channels.cache.set(updated.id, updated, { storage: data.guild_id })

    if (data.member) {
      let member = await this.app.internals.cache.get<string, ThreadMember>(
        Keyspaces.ThreadMembers,
        data.id,
        'ThreadMember',
        data.member.user_id
      )

      if (member) {
        member = await member.init(data.member)
      } else {
        const ThreadMember = EntitiesUtil.get('ThreadMember')
        member = await new ThreadMember(this.app).init(data.member)
      }

      await this.app.threadMembers.cache.set(member.userId, member, { storage: data.id })
    }

    const context: ThreadUpdateEventContext = {
      shardId,
      stored,
      updated,
      threadId: data.id,
      guildId: data.guild_id
    }

    this.app.emit(EventNames.THREAD_UPDATE, context)
    return context
  }
}