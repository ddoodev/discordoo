import {
  RawAbstractComponentInteractionData,
  RawInteractionResolvedData,
  SelectMenuTypes
} from '../../../../../../../src/api'

export interface RawSelectComponentInteractionData extends RawAbstractComponentInteractionData {
  component_type: SelectMenuTypes
  resolved?: RawInteractionResolvedData
  values: string[]
}
