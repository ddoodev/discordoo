import { Json, ToJsonProperties } from '@src/api/entities/interfaces'
import { attach } from '@src/utils'
import { AbstractViewableGuild } from '@src/api/entities/guild/AbstractViewableGuild'
import { GuildMembersManager } from '@src/api/managers/members/GuildMembersManager'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { GuildChannelsManager } from '@src/api/managers/channels/GuildChannelsManager'
import { GuildPresencesManager } from '@src/api/managers/presences/GuildPresencesManager'
import { CacheManagerGetOptions } from '@src/cache'
import { GuildData } from '@src/api/entities/guild/interfaces/GuildData'
import { RawGuildData } from '@src/api/entities/guild/interfaces/RawGuildData'
import { DiscordLocale } from '@src/constants/common/DiscordLocale'
import { AnyGuildWritableChannel } from '@src/api/entities/channel/interfaces/AnyGuildWritableChannel'
import { GuildMember } from '@src/api/entities/member/GuildMember'

export class Guild extends AbstractViewableGuild {
  public unavailable = false
  public declare members: GuildMembersManager
  public declare channels: GuildChannelsManager
  public declare presences: GuildPresencesManager
  public declare preferredLocale: DiscordLocale
  public declare rulesChannelId?: string
  public declare publicUpdatesChannelId?: string
  public declare systemChannelId?: string

  async init(data: GuildData | RawGuildData, options?: EntityInitOptions): Promise<this> {
    await super.init(data)

    await attach(this, data, {
      props: [
        'unavailable',
        [ 'preferredLocale', 'preferred_locale' ],
        [ 'rulesChannelId', 'rules_channel_id' ],
        [ 'publicUpdatesChannelId', 'public_updates_channel_id' ],
        [ 'systemChannelId', 'system_channel_id' ],
      ],
      disabled: options?.ignore,
      enabled: [ 'unavailable' ]
    })

    if (!this.members) {
      this.members = new GuildMembersManager(this.client, {
        guild: this.id,
      })
    }

    if (!this.channels) {
      this.channels = new GuildChannelsManager(this.client, {
        guild: this.id,
      })
    }

    if (!this.presences) {
      this.presences = new GuildPresencesManager(this.client, {
        guild: this.id,
      })
    }

    return this
  }

  me(options?: CacheManagerGetOptions): Promise<GuildMember | undefined> {
    return this.members.cache.get(this.client.user.id, options)
  }

  async rulesChannel(options?: CacheManagerGetOptions): Promise<AnyGuildWritableChannel | undefined> {
    return this.rulesChannelId ? this.channels.cache.get<AnyGuildWritableChannel>(this.rulesChannelId, options) : undefined
  }

  async publicUpdatesChannel(options?: CacheManagerGetOptions): Promise<AnyGuildWritableChannel | undefined> {
    return this.publicUpdatesChannelId ? this.channels.cache.get<AnyGuildWritableChannel>(this.publicUpdatesChannelId, options) : undefined
  }

  async systemChannel(options?: CacheManagerGetOptions): Promise<AnyGuildWritableChannel | undefined> {
    return this.systemChannelId ? this.channels.cache.get<AnyGuildWritableChannel>(this.systemChannelId, options) : undefined
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      unavailable: true,
      rulesChannelId: true,
      publicUpdatesChannelId: true,
      systemChannelId: true,
    }, obj)
  }
}