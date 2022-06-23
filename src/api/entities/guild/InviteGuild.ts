import { ViewableGuildData } from '@src/api/entities/guild/interfaces/ViewableGuildData'
import { RawViewableGuildData } from '@src/api/entities/guild/interfaces/RawViewableGuildData'
import { Json, ToJsonProperties } from '@src/api/entities/interfaces'
import { AbstractViewableGuild } from '@src/api/entities/guild/AbstractViewableGuild'

export class InviteGuild extends AbstractViewableGuild {

  async init(data: ViewableGuildData | RawViewableGuildData): Promise<this> {
    await super.init(data)
    return this
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties
    }, obj)
  }

}