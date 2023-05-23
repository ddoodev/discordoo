import { ComponentTypes } from '@src/constants'
import {
  RawAbstractMessageComponentInteractionData
} from '@src/api/entities/interaction/interactions/interfaces/RawAbstractMessageComponentInteractionData'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { attach } from '@src/utils'
import { Json, ToJsonProperties } from '@src/api'

export abstract class MessageComponentInteractionData extends AbstractEntity {
  declare customId: string
  declare type: ComponentTypes

  async init(data: RawAbstractMessageComponentInteractionData, options?: EntityInitOptions): Promise<this> {
    attach(this, data, {
      props: [
        [ 'customId', 'custom_id' ],
        'type'
      ],
      disabled: options?.ignore,
      enabled: [ 'type' ]
    })

    return this
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      customId: true,
      type: true,
    }, obj)
  }
}
