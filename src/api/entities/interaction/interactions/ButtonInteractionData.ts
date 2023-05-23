import { MessageComponentInteractionData } from '@src/api/entities/interaction/interactions/MessageComponentInteractionData'
import { ComponentTypes } from '@src/constants'
export class ButtonInteractionData extends MessageComponentInteractionData {
  public type = ComponentTypes.Button
}
