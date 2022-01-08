import { AbstractEvent } from '@src/events'
import { ChannelTypes, EventNames, Keyspaces } from '@src/constants'
import { RawThreadListSyncEventData } from '@src/events/thread/RawThreadListSyncEventData'
import { AnyThreadChannel } from '@src/api/entities/channel/interfaces/AnyThreadChannel'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { ThreadMember } from '@src/api/entities/member/ThreadMember'
import { Collection } from '@discordoo/collection'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'

export class ThreadListSyncEvent extends AbstractEvent {
  public name = EventNames.THREAD_LIST_SYNC

  async execute(shardId: number, data: RawThreadListSyncEventData) {

    const threads = new Collection<string, AnyThreadChannel>(),
      members = new Collection<string, ThreadMember>()

    const predicate = (channel: AnyGuildChannel | AnyThreadChannel) => {
      if (
        (channel.type === ChannelTypes.GUILD_NEWS_THREAD
        || channel.type === ChannelTypes.GUILD_PRIVATE_THREAD
        || channel.type === ChannelTypes.GUILD_PUBLIC_THREAD)
        && (data.channel_ids?.includes(channel.id) ?? true)
      ) {
        return !channel.metadata?.archived
      }

      return false
    }

    await this.client.internals.cache.sweep<string, AnyGuildChannel | AnyThreadChannel>(
      Keyspaces.CHANNELS,
      data.guild_id,
      'channelEntityKey',
      predicate
    )

    for await (const threadData of data.threads) {
      let thread = await this.client.internals.cache.get(
        Keyspaces.CHANNELS,
        data.guild_id,
        'channelEntityKey',
        threadData.id,
      )

      if (thread) {
        thread = await thread.init(threadData)
      } else {
        const Thread: any = EntitiesUtil.get('channelEntityKey', threadData)
        thread = await new Thread(this.client).init(threadData)
      }

      await this.client.channels.cache.set(thread.id, thread, { storage: data.guild_id })
      threads.set(threadData.id, thread)
    }

    for await (const memberData of data.members) {
      let member = await this.client.internals.cache.get(
        Keyspaces.THREAD_MEMBERS,
        memberData.id,
        'ThreadMember',
        memberData.user_id,
      )

      if (member) {
        member = await member.init(memberData)
      } else {
        const Member: any = EntitiesUtil.get('ThreadMember')
        member = await new Member(this.client).init(memberData)
      }

      await this.client.threadMembers.cache.set(memberData.user_id, member, { storage: memberData.id })
      members.set(memberData.user_id, member)
    }

    this.client.emit(EventNames.THREAD_LIST_SYNC, {
      shardId,
      threads,
      members,
      parents: data.channel_ids,
      guildId: data.guild_id,
    })
  }
}