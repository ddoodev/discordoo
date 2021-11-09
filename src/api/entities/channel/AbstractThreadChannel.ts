import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import { AbstractThreadChannelData } from '@src/api/entities/channel/interfaces/AbstractThreadChannelData'
import { RawAbstractThreadChannelData } from '@src/api/entities/channel/interfaces/RawAbstractThreadChannelData'
import { Json, ToJsonProperties } from '@src/api'
import { ThreadMetadata } from '@src/api/entities/channel/interfaces/ThreadMetadata'
import { attach } from '@src/utils'

export abstract class AbstractThreadChannel extends AbstractChannel implements AbstractThreadChannelData {
  public guildId!: string
  public lastMessageId?: string
  public lastPinTimestamp?: string
  public memberCount?: number
  public messageCount?: number
  public ownerId?: string
  public parentId?: string
  public rateLimitPerUser?: number
  public threadMetadata?: ThreadMetadata

  async init(data: AbstractThreadChannelData | RawAbstractThreadChannelData): Promise<this> {
    await super.init(data)

    attach(this, data, [
      [ 'guildId', 'guild_id' ],
      [ 'parentId', 'parent_id' ],
      [ 'ownerId', 'owner_id' ],
      [ 'lastMessageId', 'last_message_id' ],
      [ 'lastPinTimestamp', 'last_pin_timestamp' ],
      [ 'rateLimitPerUser', 'rate_limit_per_user' ],
      [ 'messageCount', 'message_count' ],
      [ 'memberCount', 'member_count' ],
    ])

    return this
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      guildId: true,
      lastMessageId: true,
      lastPinTimestamp: true,
      memberCount: true,
      messageCount: true,
      ownerId: true,
      parentId: true,
      rateLimitPerUser: true,
      threadMetadata: true,
    }, obj)
  }

}
