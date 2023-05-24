import {
  AppCommandInteractionOptionPayload,
  InteractionResolvedCacheManager, Json,
  RawAppCommandInteractionData,
  RawInteractionResolvedData, ToJsonProperties
} from '@src/api'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { AppCommandTypes, ToJsonOverrideSymbol } from '@src/constants'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { attach } from '@src/utils'

export class AppCommandInteractionData extends AbstractEntity {
  declare id: string
  declare type: AppCommandTypes
  declare name: string
  declare resolved?: InteractionResolvedCacheManager
  declare options: AppCommandInteractionOptionPayload[]
  private declare _resolved?: RawInteractionResolvedData

  async init(
    data: RawAppCommandInteractionData & { guildId?: string; channelId?: string },
    options?: EntityInitOptions): Promise<this> {
    attach(this, data, {
      props: [
        'id',
        'type',
        'options',
        'name'
      ],
      disabled: options?.ignore,
      enabled: [ 'id' ]
    })

    if (data.resolved) {
      this._resolved = data.resolved
      this.resolved = new InteractionResolvedCacheManager(this.app, {
        ...data.resolved,
        guildId: data.guildId,
        channelId: data.channelId
      })
    }

    return this
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      id: true,
      type: true,
      options: true,
      resolved: {
        override: ToJsonOverrideSymbol,
        value: this._resolved
      }
    }, obj)
  }
}
