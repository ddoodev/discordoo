import { AbstractEvent, ThreadMembersUpdateEventContext } from '@src/events'
import { EventNames } from '@src/constants'
import { RawThreadMembersUpdateEventData } from '@src/events/thread/RawThreadMembersUpdateEventData'
import { AnyThreadChannel, EntitiesUtil, GuildMember, ThreadMember } from '@src/api'
import { Collection } from '@discordoo/collection'

export class ThreadMembersUpdateEvent extends AbstractEvent {
  public name = EventNames.THREAD_MEMBERS_UPDATE

  async execute(shardId: number, data: RawThreadMembersUpdateEventData) {

    const thread: AnyThreadChannel | undefined = await this.client.channels.cache.get(data.id, { storage: data.guild_id })
    if (thread) {
      await thread.init({
        member_count: data.member_count,
        guild_id: data.guild_id,
        id: thread.id,
        type: thread.type
      })

      await thread.client.channels.cache.set(thread.id, thread, { storage: thread.guildId })
    }

    /*
    * don't use .filter because if there are a lot of people in the thread,
    * a very performance-impact operation will be performed every event
    * */
    const removed: Collection<string, ThreadMember> = new Collection()

    for await (const id of data.removed_member_ids ?? []) {
      const member = await this.client.threadMembers.cache.get(id, { storage: data.id })
      if (member) removed.set(id, member)
    }

    if (data.removed_member_ids?.length) {
      await this.client.threadMembers.cache.delete(data.removed_member_ids, { storage: data.id })
    }

    const added: Collection<string, ThreadMember> = new Collection(),
      addedGuildMembers: Collection<string, GuildMember> = new Collection(),
      TMember = EntitiesUtil.get('ThreadMember'),
      GMember = EntitiesUtil.get('GuildMember'),
      Presence = EntitiesUtil.get('Presence')

    for await (const member of data.added_members ?? []) {
      const threadMember = await new TMember(this.client).init(member)
      const guildMember = await new GMember(this.client).init(member.member)
      const presence = member.presence ? await new Presence(this.client).init(member.presence) : undefined

      await this.client.members.cache.set(member.user_id, guildMember, { storage: data.guild_id })
      await this.client.threadMembers.cache.set(member.user_id, threadMember, { storage: data.id })
      if (presence) await this.client.presences.cache.set(member.user_id, presence, { storage: data.guild_id })

      added.set(member.user_id, threadMember)
      addedGuildMembers.set(member.user_id, guildMember)
    }

    const context: ThreadMembersUpdateEventContext = {
      shardId,
      thread,
      threadId: data.id,
      guildId: data.guild_id,
      added,
      addedGuildMembers,
      addedIds: data.added_members?.map(m => m.user_id) ?? [],
      removed,
      removedIds: data.removed_member_ids ?? [],
    }

    this.client.emit(EventNames.THREAD_MEMBERS_UPDATE, context)
  }
}