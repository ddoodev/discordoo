import { AbstractComponentInteractionData } from '@src/api/entities/interaction/interactions/components/AbstractComponentInteractionData'
import { EntityInitOptions, RawTextInputComponentData } from '@src/api'
import { ComponentTypes } from '@src/constants'
import { attach } from '@src/utils'

export class TextInputInteractionData extends AbstractComponentInteractionData {
  declare customId: string
  declare type: ComponentTypes.TextInput
  declare value: string

  async init(data: RawTextInputComponentData, options?: EntityInitOptions) {
    await super.init(data)

    attach(this, data, {
      props: [
        'value'
      ],
      disabled: options?.ignore
    })

    return this
  }
}
