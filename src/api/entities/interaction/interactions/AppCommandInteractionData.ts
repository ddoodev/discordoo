import {
  AppCommandInteractionOptionPayload, EntityInitOptions,
  InteractionResolvedCacheManager,
  Json,
  RawAppCommandInteractionData,
  RawInteractionResolvedData,
  ToJsonProperties
} from '@src/api'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { AppCommandTypes, ToJsonOverrideSymbol } from '@src/constants'
import { attach } from '@src/utils'

export class AppCommandInteractionData extends AbstractEntity {
  declare id: string
  declare type: AppCommandTypes
  declare name: string
  declare resolved: InteractionResolvedCacheManager
  declare options: AppCommandInteractionOptionPayload[]
  private declare _resolved?: RawInteractionResolvedData

  async init(
    data: RawAppCommandInteractionData & { guildId?: string; channelId?: string },
    options?: EntityInitOptions
  ): Promise<this> {
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
    }

    this.resolved = await new InteractionResolvedCacheManager(this.app).init({
      ...data.resolved,
      guildId: data.guildId,
    })

    return this
  }

  isChatInput(): boolean {
    return this.type === AppCommandTypes.ChatInput
  }

  isMessage(): boolean {
    return this.type === AppCommandTypes.Message
  }

  isUser(): boolean {
    return this.type === AppCommandTypes.User
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
