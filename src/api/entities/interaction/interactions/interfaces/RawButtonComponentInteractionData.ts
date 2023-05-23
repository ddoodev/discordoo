import { ComponentTypes } from '@src/constants'
import { RawAbstractMessageComponentInteractionData } from '@src/api'

export interface RawButtonComponentInteractionData extends RawAbstractMessageComponentInteractionData {
  component_type: ComponentTypes.Button
}
