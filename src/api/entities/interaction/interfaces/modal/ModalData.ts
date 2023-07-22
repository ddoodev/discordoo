import { ActionRowData } from '../../../../../../src/api'

export interface ModalData {
  title: string
  customId: string
  components: ActionRowData[]
}
