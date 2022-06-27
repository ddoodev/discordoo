import { ViewableGuildData } from '@src/api/entities/guild/interfaces/ViewableGuildData'
import { RawViewableGuildData } from '@src/api/entities/guild/interfaces/RawViewableGuildData'
import { Json, ToJsonProperties } from '@src/api/entities/interfaces'
import { attach } from '@src/utils'
import { AbstractViewableGuild } from '@src/api/entities/guild/AbstractViewableGuild'
import { GuildMembersManager } from '@src/api/managers/members/GuildMembersManager'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class Guild extends AbstractViewableGuild {
  public unavailable = false
  public declare members: GuildMembersManager

  async init(data: ViewableGuildData | RawViewableGuildData, options?: EntityInitOptions): Promise<this> {
    await super.init(data)

    await attach(this, data, {
      props: [
        'unavailable',
      ],
      disabled: options?.ignore,
      enabled: [ 'unavailable' ]
    })

    if (!this.members) {
      this.members = new GuildMembersManager(this.client, {
        guildId: this.id,
      })
    }

    return this
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      unavailable: true,
    }, obj)
  }
}