import { AbstractEvent } from '@src/events'
import { EventNames } from '@src/constants'
import { EntitiesUtil, RawThreadMemberData } from '@src/api'
import { ThreadMemberUpdateEventContext } from '@src/events/thread/ctx/ThreadMemberUpdateEventContext'

export class ThreadMemberUpdateEvent extends AbstractEvent {
  public name = EventNames.THREAD_MEMBER_UPDATE

  async execute(shardId: number, data: RawThreadMemberData) {

    const Member = EntitiesUtil.get('ThreadMember')

    const stored = await this.client.threadMembers.cache.get(data.user_id, { storage: data.id })
    const updated = stored ? await (await stored._clone()).init(data) : await new Member(this.client).init(data)

    await this.client.threadMembers.cache.set(updated.userId, updated, { storage: updated.threadId })

    const context: ThreadMemberUpdateEventContext = {
      shardId,
      stored,
      updated,
      guildId: data.guild_id,
      threadId: data.id,
    }

    this.client.emit(EventNames.THREAD_MEMBER_UPDATE, context)
  }
}