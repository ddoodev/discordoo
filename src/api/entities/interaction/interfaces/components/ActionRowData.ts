import { ComponentTypes } from '../../../../../../src/constants'
import { ActionRowContainsData } from '../../../../../../src/api'

export interface ActionRowData {
  type: ComponentTypes.ActionRow
  components: ActionRowContainsData[]
}
