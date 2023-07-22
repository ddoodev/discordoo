import { AbstractEventContext } from '../../../../src/events'
import { AppCommandInteraction, AutocompleteInteraction, MessageComponentInteraction, ModalSubmitInteraction } from '../../../../src/api'

export interface InteractionCreateEventContext extends AbstractEventContext {
  interaction: MessageComponentInteraction | AppCommandInteraction | AutocompleteInteraction | ModalSubmitInteraction
}
