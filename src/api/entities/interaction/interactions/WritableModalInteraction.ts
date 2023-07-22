import { WritableInteraction } from '@src/api/entities/interaction/interactions/WritableInteraction'
import { ModalBuilder, ModalData, RawModalData } from '@src/api'

export abstract class WritableModalInteraction extends WritableInteraction {
  async sendModal(modal: ModalBuilder | ModalData | RawModalData) {
    await this.app.interactions.sendModal(this.id, this.token, modal)
  }
}
