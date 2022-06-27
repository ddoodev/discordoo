import { Interaction } from '@src/api/entities/interaction/Interaction'
import { InteractionResolvedCacheManager } from '@src/api/managers/interactions/InteractionResolvedCacheManager'
import {
  AppCommandInteractionOptionPayload, EntitiesUtil, Json,
  RawAppCommandInteractionData,
  RawInteractionData, RawInteractionResolvedData, ToJsonProperties
} from '@src/api'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { attach } from '@src/utils'
import { AppCommandTypes, InteractionTypes, ToJsonOverrideSymbol } from '@src/constants'

export class AppCommandInteraction extends Interaction {
  declare type: InteractionTypes.APPLICATION_COMMAND
  declare data: AppCommandInteractionData

  async init(
    data: RawInteractionData<RawAppCommandInteractionData>, options?: EntityInitOptions
  ): Promise<this> {
    await super.init(data, options)

    const AppCmdIntData = EntitiesUtil.get('AppCommandInteractionData')

    this.data = await new AppCmdIntData(this.client).init(
      { ...data.data, channelId: this.channelId, guildId: this.guildId },
      options
    )

    return this
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      data: true
    }, obj)
  }
}

export class AppCommandInteractionData extends AbstractEntity {
  declare id: string
  declare type: AppCommandTypes
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
      ],
      disabled: options?.ignore,
      enabled: [ 'id' ]
    })

    if (data.resolved) {
      this._resolved = data.resolved
      this.resolved = new InteractionResolvedCacheManager(this.client, {
        ...data.resolved,
        guildId: data.guildId,
        channelId: data.channelId
      })
    }

    return this
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
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