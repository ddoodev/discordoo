import { AbstractAppCommandInteractionData } from '@src/api/entities/interaction/interactions/data/AbstractAppCommandInteractionData'
import { AppCommandTypes } from '@src/constants'

export class ChatInputInteractionData extends AbstractAppCommandInteractionData {
  declare type: AppCommandTypes.ChatInput
}
