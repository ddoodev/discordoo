import { AbstractEmojiData } from '../../../../../../../src/api'
import { ButtonStyles, ComponentTypes } from '../../../../../../../src/constants'

export type RawButtonComponentData = RawButtonNonLinkComponentData | RawButtonLinkComponentData

export interface RawAbstractButtonComponentData {
  type: ComponentTypes.Button
  label?: string
  emoji?: AbstractEmojiData
  disabled?: boolean
}

export interface RawButtonNonLinkComponentData extends RawAbstractButtonComponentData {
  style: Exclude<ButtonStyles, ButtonStyles.Link>
  custom_id: string
}

export interface RawButtonLinkComponentData extends RawAbstractButtonComponentData {
  style: ButtonStyles.Link
  url: string
}
