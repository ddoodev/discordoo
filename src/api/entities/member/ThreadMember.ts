import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { ThreadMemberData } from '@src/api/entities/member/interfaces/ThreadMemberData'
import { GuildMember, Json, ReadonlyThreadMemberFlagsUtil, ToJsonProperties } from '@src/api'
import { RawThreadMemberData } from '@src/api/entities/member/interfaces/RawThreadMemberData'
import { attach } from '@src/utils'
import { CacheManagerGetOptions } from '@src/cache'
import { AnyThreadChannel } from '@src/api/entities/channel/interfaces/AnyThreadChannel'
import { Keyspaces } from '@src/constants'

export class ThreadMember extends AbstractEntity implements ThreadMemberData {
  public flags!: ReadonlyThreadMemberFlagsUtil
  public threadId?: string
  public joinTimestamp!: number
  public userId?: string

  async init(data: ThreadMemberData | RawThreadMemberData): Promise<this> {

    attach(this, data, [
      [ 'threadId', 'id' ],
      [ 'userId', 'user_id' ],
      [ 'joinTimestamp', 'join_timestamp' ],
    ])

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

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      flags: true,
      threadId: true,
      joinTimestamp: true,
      userId: true,
    }, obj)
  }

}
