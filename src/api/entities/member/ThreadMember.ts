import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { ThreadMemberData } from '@src/api/entities/member/interfaces/ThreadMemberData'
import { GuildMember, Json, ReadonlyThreadMemberFlagsUtil, ToJsonProperties, User } from '@src/api'
import { RawThreadMemberData } from '@src/api/entities/member/interfaces/RawThreadMemberData'
import { attach } from '@src/utils'
import { CacheManagerGetOptions } from '@src/cache'
import { Keyspaces } from '@src/constants'

export class ThreadMember extends AbstractEntity implements ThreadMemberData {
  public flags!: ReadonlyThreadMemberFlagsUtil
  public threadId!: string
  public joinTimestamp!: number
  public userId!: string
  public guildId!: string

  async init(data: ThreadMemberData | RawThreadMemberData): Promise<this> {

    attach(this, data, {
      props: [
        [ 'threadId', 'id' ],
        [ 'userId', 'user_id' ],
        [ 'joinTimestamp', 'join_timestamp' ],
        [ 'guildId', 'guild_id' ]
      ]
    })

    if ('flags' in data) {
      this.flags = new ReadonlyThreadMemberFlagsUtil(data.flags)
    }

    if (typeof this.joinTimestamp !== 'number'!) {
      this.joinTimestamp = new Date(this.joinTimestamp).getTime()
    }

    return this
  }

  get joinDate(): Date {
    return new Date(this.joinTimestamp)
  }

  user(options?: CacheManagerGetOptions): Promise<User | undefined> {
    return this.client.users.cache.get(this.userId, options)
  }

  guild(options?: CacheManagerGetOptions): Promise<any | undefined> { // TODO: Guild
    return this.client.guilds.cache.get(this.guildId, options)
  }

  member(options?: CacheManagerGetOptions): Promise<GuildMember | undefined> {
    return this.client.internals.cache.get(
      Keyspaces.GUILD_MEMBERS,
      this.guildId,
      'GuildMember',
      this.userId,
      options
    )
  }

  async remove(): Promise<this | undefined> {
    const result = await this.client.threadMembers.remove(this.threadId, this.userId)
    return result ? this : undefined
  }

  async add(): Promise<this | undefined> {
    const result = await this.client.threadMembers.add(this.threadId, this.userId)
    return result ? this : undefined
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      flags: true,
      threadId: true,
      joinTimestamp: true,
      userId: true,
      guildId: true,
    }, obj)
  }

}
