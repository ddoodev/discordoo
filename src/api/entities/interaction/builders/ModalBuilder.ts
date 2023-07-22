import {
  ActionRowBuilder,
  ActionRowData, ModalData,
  RawActionRowData, RawModalData
} from '../../../../../src/api'
import { attach } from '../../../../../src/utils'

export class ModalBuilder {
  declare title: string
  declare customId: string
  public components: ActionRowBuilder[] = []

  constructor(
    data?: ModalData
      | RawModalData
      | ModalBuilder
  ) {
    if (!data) return this

    attach(this, data, {
      props: [
        'title',
        [ 'customId', 'custom_id' ]
      ]
    })

    if (data instanceof ModalBuilder) {
      this.components = this.components.concat(data.components)
    } else {
      return this.addActionRows(data.components)
    }
  }

  addActionRow(component: ActionRowData | RawActionRowData | ActionRowBuilder) {
    if (component instanceof ActionRowBuilder) {
      this.components.push(component)
    } else {
      const actionRowBuilder = new ActionRowBuilder(component)
      this.components.push(actionRowBuilder)
    }

    return this
  }

  addActionRows(components: Array<ActionRowData | RawActionRowData | ActionRowBuilder>) {
    components.forEach((data) => this.addActionRow(data))
    return this
  }

  setCustomId(customId: string) {
    this.customId = customId
    return this
  }

  setTitle(title: string) {
    this.title = title
    return this
  }

  toJSON(): RawModalData {
    return {
      title: this.title,
      custom_id: this.customId,
      components: this.components.map((component) => component.toJSON())
    }
  }
}
