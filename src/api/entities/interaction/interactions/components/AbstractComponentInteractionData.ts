import { ComponentTypes } from '@src/constants'
import {
  Json,
  ToJsonProperties,
  RawAbstractComponentInteractionData,
  EntityInitOptions,
  ButtonInteractionData,
  SelectMenuInteractionData, RawTextInputComponentData, TextInputInteractionData
} from '@src/api'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { attach } from '@src/utils'

export abstract class AbstractComponentInteractionData extends AbstractEntity {
  declare customId: string
  declare type: ComponentTypes

  async init(data: RawAbstractComponentInteractionData | RawTextInputComponentData, options?: EntityInitOptions): Promise<this> {
    attach(this, data, {
      props: [
        [ 'customId', 'custom_id' ],
      ],
      enabled: [ 'customId' ],
      disabled: options?.ignore
    })

    if ('type' in data && data.type) {
      this.type = data.type
    } else if ('component_type' in data && data.component_type) {
      this.type = data.component_type
    }

    return this
  }

  isButton(): this is ButtonInteractionData {
    return this instanceof ButtonInteractionData
  }

  isSelectMenu(): this is SelectMenuInteractionData {
    return this instanceof SelectMenuInteractionData
  }

  isTextInput(): this is TextInputInteractionData {
    return this instanceof TextInputInteractionData
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      customId: true,
      type: true,
    }, obj)
  }
}
