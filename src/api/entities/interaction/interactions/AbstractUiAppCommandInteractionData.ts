import {
  EntityInitOptions,
  RawUiAppCommandInteractionData
} from '@src/api'
import { attach } from '@src/utils'
import { AbstractAppCommandInteractionData } from '@src/api/entities/interaction/interactions/AbstractAppCommandInteractionData'

export abstract class AbstractUiAppCommandInteractionData extends AbstractAppCommandInteractionData {
  declare targetId: string

  async init(data: RawUiAppCommandInteractionData, options?: EntityInitOptions) {
    await super.init(data, options)

    attach(this, data, {
      props: [
        [ 'targetId', 'target_id' ]
      ],
      disabled: options?.ignore,
    })

    return this
  }
}
