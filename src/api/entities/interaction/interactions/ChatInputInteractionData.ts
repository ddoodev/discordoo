import { AbstractAppCommandInteractionData } from '@src/api/entities/interaction/interactions/AbstractAppCommandInteractionData'
import { AppCommandTypes } from '@src/constants'

export class ChatInputInteractionData extends AbstractAppCommandInteractionData {
  declare type: AppCommandTypes.ChatInput
}
