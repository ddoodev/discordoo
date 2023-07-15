import {
  AppCommandInteractionData,
  AppCommandInteractionOptionPayload,
  AppCommandOptionChoiceData,
  AutocompleteInteractionQuery,
  EntitiesUtil,
  Json, RawAppCommandInteractionData,
  RawAppCommandOptionChoiceData,
  RawInteractionData,
  ToJsonProperties
} from '@src/api'
import { Interaction } from '@src/api/entities/interaction/interactions/Interaction'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { InteractionTypes } from '@src/constants'
import { DiscordooError } from '@src/utils'

export class AutocompleteInteraction extends Interaction {
  declare type: InteractionTypes.ApplicationCommandAutocomplete
  declare data: AppCommandInteractionData
  declare focusedOption: AutocompleteInteractionQuery

  async init(
    data: RawInteractionData<RawAppCommandInteractionData>, options?: EntityInitOptions
  ): Promise<this> {
    await super.init(data, options)

    const AppCmdIntData = EntitiesUtil.get('AppCommandInteractionData')

    this.data = await new AppCmdIntData(this.app).init(
      { ...data.data as RawAppCommandInteractionData, channelId: this.channelId, guildId: this.guildId },
      options
    )
    this.focusedOption = this.findFocusedOption(this.data.options)

    return this
  }

  async sendChoices(choices: AppCommandOptionChoiceData[] | RawAppCommandOptionChoiceData[]) {
    await this.app.interactions.sendChoices(this.id, this.token, choices)
    return this
  }

  private findFocusedOption(options: AppCommandInteractionOptionPayload[]): AutocompleteInteractionQuery {
    const focusedOption = options.find((option) => option.focused)
    if (!focusedOption) throw new DiscordooError('AutocompleteInteraction#findFocusedOption', 'Cannot find focused option')

    return {
      name: focusedOption.name,
      focused: focusedOption.focused as true,
      type: focusedOption.type as Extract<AutocompleteInteractionQuery, 'type'>,
      value: focusedOption.value!
    }
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      data: true
    }, obj)
  }
}
