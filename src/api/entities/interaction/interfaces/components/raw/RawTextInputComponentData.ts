import { ComponentTypes, TextInputStyles } from '../../../../../../../src/constants'

export interface RawTextInputComponentData {
  type: ComponentTypes.TextInput
  custom_id: string
  style: TextInputStyles
  label: string
  min_length?: number
  max_length?: number
  required?: boolean
  value?: string
  placeholder?: string
}
