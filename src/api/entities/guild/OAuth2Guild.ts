import { AbstractGuild } from '@src/api/entities/guild/AbstractGuild'
import { OAuth2GuildData } from '@src/api/entities/guild/interfaces/OAuth2GuildData'
import { Json, ReadonlyPermissions, ToJsonProperties } from '@src/api'
import { RawOAuth2GuildData } from '@src/api/entities/guild/interfaces/RawOAuth2GuildData'
import { attach } from '@src/utils'

export class OAuth2Guild extends AbstractGuild implements OAuth2GuildData {
  public declare owner: boolean
  public declare permissions: ReadonlyPermissions

  async init(data: OAuth2GuildData | RawOAuth2GuildData): Promise<this> {
    await super.init(data)

    attach(this, data, {
      props: [
        [ 'owner', '', false ],
      ]
    })

    if ('permissions' in data) {
      this.permissions = new ReadonlyPermissions(data.permissions)
    } else if (!this.permissions) {
      this.permissions = new ReadonlyPermissions()
    }

    return this
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      owner: true,
      permissions: true,
    }, obj)
  }

}