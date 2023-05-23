import { Interaction } from '@src/api/entities/interaction/interactions/Interaction'
import { InteractionTypes } from '@src/constants'
import {
  AppCommandInteractionData, EntitiesUtil, Json, RawAppCommandInteractionData, RawInteractionData, ToJsonProperties
} from '@src/api'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class AppCommandInteraction extends Interaction {
  declare type: InteractionTypes.ApplicationCommand
  declare data: AppCommandInteractionData

  async init(
    data: RawInteractionData<RawAppCommandInteractionData>, options?: EntityInitOptions
  ): Promise<this> {
    await super.init(data, options)

    const AppCmdIntData = EntitiesUtil.get('AppCommandInteractionData')

    this.data = await new AppCmdIntData(this.app).init(
      { ...data.data as RawAppCommandInteractionData, channelId: this.channelId, guildId: this.guildId },
      options
    )

    return this
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      data: true
    }, obj)
  }
}
