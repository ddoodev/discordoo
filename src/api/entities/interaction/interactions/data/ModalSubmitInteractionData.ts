import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { ActionRowInteractionData, EntitiesUtil, EntityInitOptions, RawModalSubmitInteractionInitData } from '@src/api'
import { attach } from '@src/utils'

export class ModalSubmitInteractionData extends AbstractEntity {
  declare customId: string
  declare components: ActionRowInteractionData[]

  async init(data: RawModalSubmitInteractionInitData, options?: EntityInitOptions) {
    attach(this, data, {
      props: [ [ 'customId', 'custom_id' ] ],
      disabled: options?.ignore,
      enabled: [ 'customId' ]
    })

    const ActRowInteractionData = EntitiesUtil.get('ActionRowInteractionData')

    this.components = await Promise.all(data.components.map(async (component) => {
      // guild_id for future select menu in modal
      return await new ActRowInteractionData(this.app).init({ ...component, guildId: data.guildId })
    }))

    return this
  }
}
