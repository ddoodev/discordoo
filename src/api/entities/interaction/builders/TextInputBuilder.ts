import { ComponentTypes, TextInputStyles } from '@src/constants'
import { RawTextInputComponentData, TextInputComponentData } from '@src/api'
import { attach } from '@src/utils'

export class TextInputBuilder {
  declare customId: string
  declare style: TextInputStyles
  declare label: string
  public minLength?: number
  public maxLength?: number
  public required?: boolean
  public value?: string
  public placeholder?: string

  constructor(data?: TextInputComponentData | RawTextInputComponentData) {
    if (!data) return this

    attach(this, data, {
      props: [
        'style',
        'label',
        'required',
        'value',
        'placeholder',
        [ 'minLength', 'min_length' ],
        [ 'maxLength', 'max_length' ],
        [ 'customId', 'custom_id' ],
      ]
    })
  }

  setCustomId(customId: string) {
    this.customId = customId
    return this
  }

  setLabel(label: string) {
    this.label = label
    return this
  }

  setMaxLength(maxLength: number) {
    this.maxLength = maxLength
    return this
  }

  setMinLength(minLength: number) {
    this.minLength = minLength
    return this
  }

  setPlaceholder(placeholder: string) {
    this.placeholder = placeholder
    return this
  }

  setRequired(required: boolean) {
    this.required = required
    return this
  }

  setStyle(style: TextInputStyles) {
    this.style = style
    return this
  }

  setValue(value: string) {
    this.value = value
    return this
  }

  toJSON(): RawTextInputComponentData {
    return {
      custom_id: this.customId,
      label: this.label,
      max_length: this.maxLength,
      min_length: this.minLength,
      placeholder: this.placeholder,
      required: this.required,
      style: this.style,
      type: ComponentTypes.TextInput,
      value: this.value
    }
  }
}
