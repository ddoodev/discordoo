import {
  RawSelectMenuComponentData,
  RawSelectMenuDefaultValueData,
  SelectMenuComponentData, SelectMenuDefaultValueData,
  SelectMenuOptionData,
  SelectMenuTypes
} from '@src/api'
import { ChannelTypes } from '@src/constants'
import { attach, DiscordooError, resolveSelectMenuDefaultValueId } from '@src/utils'

export class SelectMenuBuilder {
  declare type: SelectMenuTypes
  declare customId: string
  public placeholder?: string
  public minValues?: number
  public maxValues?: number
  public disabled?: boolean
  public options: SelectMenuOptionData[] = []
  public channelTypes?: ChannelTypes[]
  public defaultValues: RawSelectMenuDefaultValueData[] = []

  constructor(data?: SelectMenuComponentData | RawSelectMenuComponentData) {
    if (!data) return this

    attach(this, data, {
      props: [
        'type',
        'placeholder',
        'disabled',
        'options',
        [ 'customId', 'custom_id' ],
        [ 'minValues', 'min_values' ],
        [ 'maxValues', 'max_values' ],
        [ 'channelTypes', 'channel_types' ]
      ]
    })
  }

  addDefaultValue(defaultValue: SelectMenuDefaultValueData | RawSelectMenuDefaultValueData) {
    const id = resolveSelectMenuDefaultValueId(defaultValue.id)
    if (!id) {
      throw new DiscordooError('SelectMenuBuilder#addDefaultValue', 'Cannot add default value without id.')
    }

    const defaultValueData: RawSelectMenuDefaultValueData = {
      id: id,
      type: defaultValue.type
    }

    this.defaultValues.push(defaultValueData)
    return this
  }

  addDefaultValues(defaultValues: Array<SelectMenuDefaultValueData | RawSelectMenuDefaultValueData>) {
    defaultValues.forEach((defaultValue) => this.addDefaultValue(defaultValue))
    return this
  }

  addOption(option: SelectMenuOptionData) {
    this.options.push(option)
    return this
  }

  addOptions(options: SelectMenuOptionData[]) {
    this.options.push(...options)
    return this
  }

  setChannelTypes(channelTypes: ChannelTypes[]) {
    this.channelTypes = channelTypes
    return this
  }

  setCustomId(customId: string) {
    this.customId = customId
    return this
  }

  setDisabled(disabled: boolean) {
    this.disabled = disabled
    return this
  }

  setMaxValues(maxValues: number) {
    this.maxValues = maxValues
    return this
  }

  setMinValues(minValues: number) {
    this.minValues = minValues
    return this
  }

  setPlaceholder(placeholder: string) {
    this.placeholder = placeholder
    return this
  }

  setType(type: SelectMenuTypes) {
    this.type = type
    return this
  }

  toJSON(): RawSelectMenuComponentData {
    return {
      channel_types: this.channelTypes,
      custom_id: this.customId,
      default_values: this.defaultValues,
      disabled: this.disabled,
      max_values: this.maxValues,
      min_values: this.minValues,
      options: this.options,
      placeholder: this.placeholder,
      type: this.type,
    }
  }
}
