import { ComponentTypes } from '@src/constants'
import { RawActionRowContainsData } from '@src/api'

export interface RawActionRowData {
  type: ComponentTypes.ActionRow
  components: RawActionRowContainsData[]
}
