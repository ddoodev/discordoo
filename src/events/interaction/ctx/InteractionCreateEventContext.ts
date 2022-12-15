import { AbstractEventContext } from '@src/events'
import { AppCommandInteraction } from '@src/api'

export interface InteractionCreateEventContext extends AbstractEventContext {
  interaction: AppCommandInteraction
}