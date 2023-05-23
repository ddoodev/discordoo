import { ButtonStyles, ComponentTypes } from '@src/constants'
import { AbstractEmojiData } from '@src/api'

export type ButtonComponentData = ButtonNonLinkComponentData | ButtonLinkComponentData

export interface AbstractButtonComponentData {
  type: ComponentTypes.Button
  label?: string
  emoji?: Required<AbstractEmojiData>
  disabled?: boolean
}

export interface ButtonNonLinkComponentData extends AbstractButtonComponentData {
  style: Exclude<ButtonStyles, ButtonStyles.Link>
  customId: string
}

export interface ButtonLinkComponentData extends AbstractButtonComponentData {
  style: ButtonStyles.Link
  url: string
}
