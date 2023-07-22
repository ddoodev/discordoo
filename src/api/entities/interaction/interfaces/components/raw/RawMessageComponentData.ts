import { ComponentTypes } from '../../../../../../../src/constants'
import { SelectMenuOptionData } from '../../../../../../../src/api'

export interface RawMessageComponentData {
  custom_id: string
  component_type: ComponentTypes
  values?: SelectMenuOptionData[]
}
