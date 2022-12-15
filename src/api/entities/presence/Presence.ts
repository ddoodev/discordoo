import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { PresenceData } from '@src/api/entities/presence/interfaces/PresenceData'
import { PresenceStatus } from '@src/api/entities/presence/interfaces/PresenceStatus'
import { PresenceClientStatusData } from '@src/api/entities/presence/interfaces/PresenceClientStatusData'
import { EntitiesUtil, Guild, GuildMember, Json, ToJsonProperties, User } from '@src/api'
import { RawPresenceData } from '@src/api/entities/presence/interfaces/RawPresenceData'
import { attach } from '@src/utils'
import { PresenceActivity } from '@src/api/entities/presence/PresenceActivity'
import { CacheManagerGetOptions } from '@src/cache'
import { Keyspaces, ToJsonOverrideSymbol } from '@src/constants'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class Presence extends AbstractEntity {
  public activities: PresenceActivity[] = []
  public appStatus: PresenceClientStatusData = {}
  public declare guildId: string
  public declare status: PresenceStatus
  public declare userId: string

  async init(data: PresenceData | RawPresenceData, options?: EntityInitOptions): Promise<this> {

    const Activity = EntitiesUtil.get('PresenceActivity')

    if ('activities' in data) {
      const activities: any[] = []

      for await (const activity of data.activities) {
        activities.push(await new Activity(this.app).init(activity))
      }

      data.activities = activities
    }

    if ('user' in data) {
      (data as any).userId = data.user.id
    }

    attach(this, data, {
      props: [
        [ 'guildId', 'guild_id' ],
        [ 'appStatus', 'app_status' ],
        'status',
        'userId',
        'activities',
      ],
      disabled: options?.ignore,
      enabled: [ 'guildId', 'userId', 'status' ]
    })

    return this
  }

  async member(options?: CacheManagerGetOptions): Promise<GuildMember | undefined> {
    return this.app.internals.cache.get(
      Keyspaces.GuildMembers,
      this.guildId,
      'GuildMember',
      this.userId,
      options
    )
  }

  async guild(options?: CacheManagerGetOptions): Promise<Guild | undefined> {
    return this.app.guilds.cache.get(this.guildId, options)
  }

  async user(options?: CacheManagerGetOptions): Promise<User | undefined> {
    return this.app.users.cache.get(this.userId, options)
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      activities: {
        override: ToJsonOverrideSymbol,
        value: this.activities.map(a => a.toJson())
      },
      appStatus: true,
      guildId: true,
      status: true,
      userId: true,
    }, obj)
  }
}
