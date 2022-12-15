import { AbstractEvent } from '@src/events'
import { EventNames } from '@src/constants'
import {
  EntitiesUtil,
  RawAppCommandInteractionData,
  RawInteractionData,
  RawUiAppCommandInteractionData
} from '@src/api'

export class InteractionCreateEvent extends AbstractEvent<any> {
  public name = EventNames.INTERACTION_CREATE

  async execute(shardId: number, interaction: RawInteractionData<RawAppCommandInteractionData | RawUiAppCommandInteractionData>) {
    const Cmd = EntitiesUtil.get('AppCommandInteraction')
    const int = await new Cmd(this.app).init(interaction)

    this.app.emit(EventNames.INTERACTION_CREATE, {
      shardId,
      interaction: int
    })
  }
}