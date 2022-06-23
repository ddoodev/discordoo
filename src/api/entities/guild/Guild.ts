import { ViewableGuildData } from '@src/api/entities/guild/interfaces/ViewableGuildData'
import { RawViewableGuildData } from '@src/api/entities/guild/interfaces/RawViewableGuildData'
import { Json, ToJsonProperties } from '@src/api/entities/interfaces'
import { attach } from '@src/utils'
import { AbstractViewableGuild } from '@src/api/entities/guild/AbstractViewableGuild'

export class Guild extends AbstractViewableGuild {
  public unavailable = false

  async init(data: ViewableGuildData | RawViewableGuildData): Promise<this> {
    await super.init(data)

    await attach(this, data, {
      props: [
        'unavailable',
      ]
    })

    return this
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      unavailable: true,
    }, obj)
  }
}