import { InteractionTypes } from '@src/constants'
import {
  AppCommandInteractionData, EntitiesUtil, EntityInitOptions, Json, RawAppCommandInteractionData, RawInteractionData, ToJsonProperties
} from '@src/api'
import { WritableModalInteraction } from '@src/api/entities/interaction/interactions/WritableModalInteraction'

export class AppCommandInteraction extends WritableModalInteraction {
  declare type: InteractionTypes.ApplicationCommand
  declare data: AppCommandInteractionData

  async init(
    data: RawInteractionData<RawAppCommandInteractionData>, options?: EntityInitOptions
  ): Promise<this> {
    await super.init(data, options)

    const AppCmdIntData = EntitiesUtil.get('AppCommandInteractionData')

    this.data = await new AppCmdIntData(this.app).init(
      { ...data.data, channelId: this.channelId, guildId: this.guildId },
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
