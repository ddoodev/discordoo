import { AbstractApplicationEventsHandlers } from '../../../src/events/apps/AbstractApplicationEventsHandlers'
import { InteractionCreateEventContext } from '../../../src/events'

export interface RestApplicationEventsHandlers extends AbstractApplicationEventsHandlers {
  /** User used an interaction */
  interactionCreate: (context: InteractionCreateEventContext) => any
}