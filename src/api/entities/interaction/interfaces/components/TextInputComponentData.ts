import { ComponentTypes, TextInputStyles } from '@src/constants'

export interface TextInputComponentData {
  type: ComponentTypes.TextInput
  customId: string
  style: TextInputStyles
  label: string
  minLength?: number
  maxLength?: number
  required?: boolean
  value?: string
  placeholder?: string
}
