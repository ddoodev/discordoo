import {
  ButtonInteractionData,
  EntitiesUtil,
  RawButtonComponentInteractionData,
  RawInteractionData, RawSelectComponentInteractionData, SelectMenuInteractionData
} from '../../../../../src/api'
import { EntityInitOptions } from '../../../../../src/api/entities/EntityInitOptions'
import { WritableComponentInteraction } from '../../../../../src/api/entities/interaction/interactions/WritableComponentInteraction'
import { ComponentTypes } from '../../../../../src/constants'

export class MessageComponentInteraction extends WritableComponentInteraction {
  declare data: ButtonInteractionData | SelectMenuInteractionData

  async init(
    interaction: RawInteractionData<RawButtonComponentInteractionData | RawSelectComponentInteractionData>,
    options?: EntityInitOptions): Promise<this>
  {
    await super.init(interaction, options)

    const ButtonIntData = EntitiesUtil.get('ButtonInteractionData')
    const SelectMenuIntData = EntitiesUtil.get('SelectMenuInteractionData')

    const { data } = interaction

    switch (data.component_type) {
      case ComponentTypes.Button:
        this.data = await new ButtonIntData(this.app).init(data, options)
        break
      case ComponentTypes.UserSelect:
      case ComponentTypes.ChannelSelect:
      case ComponentTypes.RoleSelect:
      case ComponentTypes.MentionableSelect:
      case ComponentTypes.StringSelect:
        this.data = await new SelectMenuIntData(this.app).init({ ...data, guildId: interaction.guild_id }, options)
        break
      default:
        // TODO: log about this
        this.data = data as any // fallback for future component types
    }

    return this
  }
}
