import { AbstractEventContext } from '@src/events'
import { AppCommandInteraction, MessageComponentInteraction } from '@src/api'

export interface InteractionCreateEventContext extends AbstractEventContext {
  interaction: MessageComponentInteraction | AppCommandInteraction
}
