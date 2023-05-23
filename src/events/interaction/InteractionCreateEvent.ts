import { AbstractEvent, InteractionCreateEventContext } from '@src/events'
import { EventNames, InteractionTypes } from '@src/constants'
import {
  EntitiesUtil,
  RawAppCommandInteractionData,
  RawInteractionData, RawModalSubmitData,
  RawUiAppCommandInteractionData
} from '@src/api'

export class InteractionCreateEvent extends AbstractEvent<InteractionCreateEventContext> {
  public name = EventNames.INTERACTION_CREATE

  async execute(
    shardId: number,
    data: RawInteractionData<RawAppCommandInteractionData | RawUiAppCommandInteractionData | RawModalSubmitData>
    ): Promise<InteractionCreateEventContext> {

    let Interaction
    switch (data.type) {
      case InteractionTypes.ApplicationCommand:
        Interaction = EntitiesUtil.get('AppCommandInteraction')
        break
      case InteractionTypes.ApplicationCommandAutocomplete:
        break
      case InteractionTypes.MessageComponent:
        Interaction = EntitiesUtil.get('MessageComponentInteraction')
        break
      case InteractionTypes.ModalSubmit:
        break
      case InteractionTypes.Ping:
        break
    }

    const context: InteractionCreateEventContext = {
      shardId,
      interaction: await new Interaction(this.app).init(data)
    }

    this.app.emit(EventNames.INTERACTION_CREATE, context)
    return context
  }
}
