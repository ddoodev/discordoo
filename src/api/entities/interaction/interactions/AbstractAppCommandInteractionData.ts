import {
  AppCommandInteractionOptionPayload, EntityInitOptions,
  InteractionResolvedCacheManager,
  Json, MessageAppCommandInteractionData,
  RawAppCommandInteractionData,
  RawInteractionResolvedData, ChatInputInteractionData,
  ToJsonProperties, UserAppCommandInteractionData
} from '@src/api'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { AppCommandTypes, ToJsonOverrideSymbol } from '@src/constants'
import { attach } from '@src/utils'

export abstract class AbstractAppCommandInteractionData extends AbstractEntity {
  declare id: string
  declare type: AppCommandTypes
  declare name: string
  declare resolved: InteractionResolvedCacheManager
  public  options: AppCommandInteractionOptionPayload[] = []
  private _resolved?: RawInteractionResolvedData
  protected _channelId?: string
  protected _guildId?: string

  async init(
    data: RawAppCommandInteractionData & { guildId?: string; channelId?: string },
    options?: EntityInitOptions
  ): Promise<this> {
    attach(this, data, {
      props: [
        'id',
        'type',
        'options',
        'name',
        [ '_channelId', 'channelId' ],
        [ '_guildId', 'guildId' ],
      ],
      disabled: options?.ignore,
      enabled: [ 'id', '_guildId', '_channelId' ]
    })

    if (data.resolved) {
      this._resolved = data.resolved
    }

    this.resolved = await new InteractionResolvedCacheManager(this.app).init({
      ...data.resolved,
      guildId: this._guildId,
    })

    return this
  }

  isChatInput(): this is ChatInputInteractionData {
    return this instanceof ChatInputInteractionData
  }

  isMessage(): this is MessageAppCommandInteractionData {
    return this instanceof MessageAppCommandInteractionData
  }

  isUser(): this is UserAppCommandInteractionData {
    return this instanceof UserAppCommandInteractionData
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      id: true,
      name: true,
      type: true,
      options: true,
      resolved: {
        override: ToJsonOverrideSymbol,
        value: this._resolved
      }
    }, obj)
  }
}
