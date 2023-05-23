import { AbstractGuild } from '@src/api/entities/guild/AbstractGuild'
import { OAuth2GuildData } from '@src/api/entities/guild/interfaces/OAuth2GuildData'
import { Json, ReadonlyPermissions, ToJsonProperties } from '@src/api'
import { RawOAuth2GuildData } from '@src/api/entities/guild/interfaces/RawOAuth2GuildData'
import { attach } from '@src/utils'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class OAuth2Guild extends AbstractGuild implements OAuth2GuildData {
  public declare owner: boolean
  public declare permissions: ReadonlyPermissions

  async init(data: OAuth2GuildData | RawOAuth2GuildData, options?: EntityInitOptions): Promise<this> {
    await super.init(data)

    attach(this, data, {
      props: [
        [ 'owner', '', false ],
      ],
      disabled: options?.ignore
    })

    if ('permissions' in data) {
      this.permissions = new ReadonlyPermissions(data.permissions)
    } else if (!this.permissions) {
      this.permissions = new ReadonlyPermissions()
    }

    return this
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      owner: true,
      permissions: true,
    }, obj)
  }

}
