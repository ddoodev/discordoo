import {
  ActionRowBuilder,
  ActionRowData, ModalData,
  RawActionRowData, RawModalData
} from '@src/api'

export class ModalBuilder {
  declare title: string
  declare customId: string
  public components: ActionRowBuilder[] = []

  constructor(
    data?: Array<ModalData | ModalBuilder | RawModalData>
      | ModalData
      | RawModalData
      | ModalBuilder
  ) {
    if (!data) return this

    if (Array.isArray(data)) {
      data.forEach((component) => {
        if (component instanceof ModalBuilder) {
          this.components.concat(component.components)
        } else {
          const modalBuilder = new ModalBuilder(component)
          this.components.concat(modalBuilder.components)
        }
      })
    } else if (data instanceof ModalBuilder) {
      this.components.concat(data.components)
    } else {
      this.title = data.title
      return this.addActionRows(data.components)
    }
  }

  addActionRow(component: ActionRowData | RawActionRowData | ActionRowBuilder) {
    if (component instanceof ActionRowBuilder) {
      this.components.concat(component)
    } else {
      const actionRowBuilder = new ActionRowBuilder(component)
      this.components.push(actionRowBuilder)
    }

    return this
  }

  addActionRows(components: Array<ActionRowData | RawActionRowData | ActionRowBuilder>) {
    components.forEach(this.addActionRow)
    return this
  }

  setTitle(title: string) {
    this.title = title
    return this
  }

  setCustomId(customId: string) {
    this.customId = customId
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
