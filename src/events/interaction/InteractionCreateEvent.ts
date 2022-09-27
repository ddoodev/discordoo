import { AbstractEvent } from '@src/events'
import { EventNames, InteractionTypes } from '@src/constants'
import { RawAppCommandInteractionData, RawInteractionData, RawUiAppCommandInteractionData } from '@src/api'

export class InteractionCreateEvent extends AbstractEvent<any> {
  public name = EventNames.INTERACTION_CREATE

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async execute(shardId: number, interaction: RawInteractionData<RawAppCommandInteractionData | RawUiAppCommandInteractionData>) {
  }
}