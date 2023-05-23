import { Interaction } from '@src/api/entities/interaction/interactions/Interaction'
import {
  AnyRawComponentInteractionData,
  ButtonInteractionData,
  EntitiesUtil,
  RawInteractionData,
  SelectMenuInteractionData
} from '@src/api'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { ComponentTypes } from '@src/constants'

export class MessageComponentInteraction extends Interaction {
  declare data: ButtonInteractionData | SelectMenuInteractionData

  async init(interaction: RawInteractionData<AnyRawComponentInteractionData>, options?: EntityInitOptions): Promise<this> {
    await super.init(interaction, options)

    const { data } = interaction

    const ButtonIntData = EntitiesUtil.get('ButtonInteractionData')
    const SelectMenuIntData = EntitiesUtil.get('SelectMenuInteractionData')

    switch (data.component_type) {
      case ComponentTypes.Button:
        this.data = await new ButtonIntData(this.app).init(data, options)
        break
      case ComponentTypes.UserSelect:
      case ComponentTypes.ChannelSelect:
      case ComponentTypes.RoleSelect:
      case ComponentTypes.MentionableSelect:
      case ComponentTypes.StringSelect:
        this.data = await new SelectMenuIntData(this.app).init(data, options)
        break
      default:
        // TODO: log about this
        this.data = data as any // fallback for future component types
    }

    return this
  }
}
