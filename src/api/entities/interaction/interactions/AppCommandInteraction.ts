import { AppCommandTypes, InteractionTypes } from '@src/constants'
import {
  ChatInputInteractionData,
  EntitiesUtil,
  EntityInitOptions,
  Json, MessageAppCommandInteractionData,
  RawAppCommandInteractionData,
  RawInteractionData,
  ToJsonProperties, UserAppCommandInteractionData
} from '@src/api'
import { WritableModalInteraction } from '@src/api/entities/interaction/interactions/WritableModalInteraction'

export class AppCommandInteraction extends WritableModalInteraction {
  declare type: InteractionTypes.ApplicationCommand
  declare data: ChatInputInteractionData | UserAppCommandInteractionData | MessageAppCommandInteractionData

  async init(
    data: RawInteractionData<RawAppCommandInteractionData>, options?: EntityInitOptions
  ): Promise<this> {
    await super.init(data, options)

    let AppCmdIntData

    switch (data.data.type) {
      case AppCommandTypes.ChatInput:
        AppCmdIntData = EntitiesUtil.get('ChatInputInteractionData')
        break
      case AppCommandTypes.User:
        AppCmdIntData = EntitiesUtil.get('UserAppCommandInteractionData')
        break
      case AppCommandTypes.Message:
        AppCmdIntData = EntitiesUtil.get('MessageAppCommandInteractionData')
        break
      default: {
        this.data = data.data as any
        // TODO: logger
        console.log('AppCommandInteraction#init', 'Unknown interaction data type', data.type)
        return this
      }
    }

    this.data = await new AppCmdIntData(this.app).init(
      { ...data.data, guildId: this.guildId, channelId: this.channelId },
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
