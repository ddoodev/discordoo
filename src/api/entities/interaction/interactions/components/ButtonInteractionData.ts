import { AbstractComponentInteractionData } from '../../../../../../src/api/entities/interaction/interactions/components/AbstractComponentInteractionData'
import { ComponentTypes } from '../../../../../../src/constants'

export class ButtonInteractionData extends AbstractComponentInteractionData {
  public type = ComponentTypes.Button
}
