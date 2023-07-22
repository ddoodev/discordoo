import { ComponentTypes } from '../../../../../../../src/constants'
import { RawAbstractComponentInteractionData } from '../../../../../../../src/api'

export interface RawButtonComponentInteractionData extends RawAbstractComponentInteractionData {
  component_type: ComponentTypes.Button
}
