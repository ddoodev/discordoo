import {
  ActionRowContains,
  ActionRowContainsData, AnyComponent,
  AnyComponentData,
  ButtonBuilder,
  RawActionRowContainsData,
  RawActionRowData,
  RawAnyComponentData,
  SelectMenuBuilder,
  TextInputBuilder
} from '@src/api'
import { ComponentTypes } from '@src/constants'

export class ActionRowBuilder {
  public components: ActionRowContains[] = []

  constructor(
    data?: Array<ActionRowContainsData | RawActionRowContainsData>
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

  private _isActionRowContainsComponent(component: any): component is ActionRowContains {
    return component instanceof ButtonBuilder
      || component instanceof SelectMenuBuilder
      || component instanceof TextInputBuilder
  }

  private _getActionRowContainsComponentInstance(componentData: ActionRowContainsData | RawActionRowContainsData): ActionRowContains {
    switch (componentData.type) {
      case ComponentTypes.Button:
        return new ButtonBuilder(componentData)
      case ComponentTypes.TextInput:
        return new TextInputBuilder(componentData)
      default:
        return new SelectMenuBuilder(componentData)
    }
  }

  addComponent(component: AnyComponent | AnyComponentData | RawAnyComponentData): this {
    if (component instanceof ActionRowBuilder) {
      this.components.concat(component.components)
    } else if (this._isActionRowContainsComponent(component)) {
      this.components.push(component)
    } else if (component.type === ComponentTypes.ActionRow) {
      this.components.concat(component.components.map(this._getActionRowContainsComponentInstance))
    } else {
      this.components.push(this._getActionRowContainsComponentInstance(component))
    }

    return this
  }

  addComponents(components: Array<ActionRowContains | ActionRowContainsData | RawActionRowContainsData>) {
    if (!components.length) return this

    const mappedComponents = components.map((component) =>
      this._isActionRowContainsComponent(component)
        ? component
        : this._getActionRowContainsComponentInstance(component)
    )

    this.components.concat(mappedComponents)
    return this
  }

  toJSON(): RawActionRowData {
    return {
      type: ComponentTypes.ActionRow,
      components: this.components.map((v) => v.toJSON())
    } as RawActionRowData
  }
}
