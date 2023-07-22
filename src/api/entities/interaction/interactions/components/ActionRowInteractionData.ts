import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import {
  ButtonInteractionData,
  EntitiesUtil,
  RawActionRowData, SelectMenuInteractionData,
  TextInputInteractionData
} from '@src/api'
import { ComponentTypes } from '@src/constants'

export class ActionRowInteractionData extends AbstractEntity {
  declare components: Array<ButtonInteractionData | SelectMenuInteractionData | TextInputInteractionData>

  async init(data: RawActionRowData & { guildId?: string }) {
    const BtnIntData = EntitiesUtil.get('ButtonInteractionData')
    const SelectMenuIntData = EntitiesUtil.get('SelectMenuInteractionData')
    const TextInputIntData = EntitiesUtil.get('TextInputInteractionData')

    this.components = await Promise.all(data.components.map(async (component) => {
      switch (component.type) {
        case ComponentTypes.UserSelect:
        case ComponentTypes.StringSelect:
        case ComponentTypes.RoleSelect:
        case ComponentTypes.MentionableSelect:
        case ComponentTypes.ChannelSelect:
          return await new SelectMenuIntData(this.app).init({ ...component, guildId: data.guildId } as any)
        case ComponentTypes.TextInput:
          return await new TextInputIntData(this.app).init(component)
        case ComponentTypes.Button:
          return await new BtnIntData(this.app).init(component as any)
      }
    }))

    return this
  }
}
