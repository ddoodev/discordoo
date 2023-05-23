import { MessageComponentInteractionData } from '@src/api/entities/interaction/interactions/MessageComponentInteractionData'
import { ComponentTypes } from '@src/constants'
import { RawSelectComponentInteractionData } from '@src/api/entities/interaction/interactions/interfaces/RawSelectComponentInteractionData'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { attach } from '@src/utils'
import { Json, ToJsonProperties } from '@src/api'

export class SelectMenuInteractionData extends MessageComponentInteractionData {
  declare type: Exclude<ComponentTypes, ComponentTypes.Button | ComponentTypes.ActionRow>
  declare values: string[]

  async init(data: RawSelectComponentInteractionData, options?: EntityInitOptions): Promise<this> {
    await super.init(data, options)

    attach(this, data, {
      props: [
        'values'
      ],
      disabled: options?.ignore,
    })

    return this
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      values: true
    }, obj)
  }
}
