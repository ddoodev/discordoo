import {
  ActionRowContains,
  ActionRowContainsData,
  AnyComponent,
  AnyComponentData,
  ButtonBuilder,
  RawActionRowContainsData,
  RawActionRowData,
  RawAnyComponentData,
  SelectMenuBuilder,
  TextInputBuilder,
} from '@src/api'
import { ComponentTypes } from '@src/constants'
import { DiscordooError } from '@src/utils'

export class ActionRowBuilder {
  public components: ActionRowContains[] = []

  constructor(
    data?:
      | Array<AnyComponent | AnyComponentData | RawAnyComponentData>
      | AnyComponent
      | AnyComponentData
      | RawAnyComponentData
  ) {
    if (!data) return this

    if (Array.isArray(data)) {
      return this.addComponents(data)
    } else {
      return this.addComponent(data)
    }
  }

  addComponent(component: AnyComponent | AnyComponentData | RawAnyComponentData): this {
    if (component instanceof ActionRowBuilder) {
      this.components.push(...component.components)
    } else if (this.isActionRowContainsComponent(component)) {
      this.components.push(component)
    } else if (component.type === ComponentTypes.ActionRow) {
      this.components.push(
        ...component.components.map((component) =>
          this.getActionRowContainsComponentInstance(component)
        )
      )
    } else {
      this.components.push(this.getActionRowContainsComponentInstance(component))
    }

    return this
  }

  addComponents(
    components: Array<AnyComponent | AnyComponentData | RawAnyComponentData>
  ) {
    if (!components.length) return this

    components.forEach((component) => this.addComponent(component))
    return this
  }

  private isActionRowContainsComponent(component: any): component is ActionRowContains {
    return (
      component instanceof ButtonBuilder ||
      component instanceof SelectMenuBuilder ||
      component instanceof TextInputBuilder
    )
  }

  private getActionRowContainsComponentInstance(
    componentData: ActionRowContainsData | RawActionRowContainsData
  ): ActionRowContains {
    switch (componentData.type) {
      case ComponentTypes.Button:
        return new ButtonBuilder(componentData)
      case ComponentTypes.TextInput:
        return new TextInputBuilder(componentData)
      case ComponentTypes.ChannelSelect:
      case ComponentTypes.MentionableSelect:
      case ComponentTypes.RoleSelect:
      case ComponentTypes.StringSelect:
      case ComponentTypes.UserSelect:
        return new SelectMenuBuilder(componentData)
      default:
        throw new DiscordooError('ActionRowBuilder#getActionRowContainsComponentInstance', 'Unknown component type')
    }
  }

  toJSON(): RawActionRowData {
    return {
      type: ComponentTypes.ActionRow,
      components: this.components.map((component) => component.toJSON()),
    } as RawActionRowData
  }
}
