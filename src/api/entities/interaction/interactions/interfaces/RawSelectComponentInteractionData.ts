import { RawAbstractMessageComponentInteractionData, SelectMenuTypes } from '@src/api'

export interface RawSelectComponentInteractionData extends RawAbstractMessageComponentInteractionData {
  component_type: SelectMenuTypes
  values: string[]
}
