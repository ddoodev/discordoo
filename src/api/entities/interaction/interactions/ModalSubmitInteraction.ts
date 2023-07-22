import { EntitiesUtil, ModalSubmitInteractionData, RawInteractionData, RawModalSubmitData } from '@src/api'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { WritableInteraction } from '@src/api/entities/interaction/interactions/WritableInteraction'

export class ModalSubmitInteraction extends WritableInteraction {
  declare data: ModalSubmitInteractionData

  async init(data: RawInteractionData<RawModalSubmitData>, options: EntityInitOptions) {
    await super.init(data, options)

    const ModalSubmitInteractionData = EntitiesUtil.get('ModalSubmitInteractionData')
    this.data = await new ModalSubmitInteractionData(this.app).init({ ...data.data, guildId: data.guild_id })

    return this
  }
}
