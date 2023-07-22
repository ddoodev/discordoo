import { AbstractEmojiData, ButtonComponentData, RawButtonComponentData } from '@src/api'
import { ButtonStyles, ComponentTypes } from '@src/constants'
import { attach } from '@src/utils'

export class ButtonBuilder {
  declare label: string
  public emoji?: AbstractEmojiData
  public disabled?: boolean
  declare style: ButtonStyles
  public customId?: string
  public url?: string

  constructor(data?: ButtonComponentData | RawButtonComponentData) {
    if (!data) return this

    attach(this, data, {
      props: [
        'label',
        'disabled',
        'style',
        'url',
        [ 'customId', 'custom_id' ]
      ]
    })

    if ('emoji' in data) this.setEmoji(data.emoji!)
  }

  setCustomId(customId: string) {
    this.customId = customId
    return this
  }

  setDisabled(disabled: boolean) {
    this.disabled = disabled
    return this
  }

  setEmoji(emoji: AbstractEmojiData | string) {
    this.emoji = typeof emoji === 'string' ? { name: emoji } : emoji
    return this
  }

  setLabel(label: string) {
    this.label = label
    return this
  }

  setStyle(style: ButtonStyles) {
    this.style = style
    return this
  }

  setUrl(url: string) {
    this.url = url
    return this
  }

  toJSON(): RawButtonComponentData {
    return  {
      type: ComponentTypes.Button,
      label: this.label,
      emoji: this.emoji,
      disabled: this.disabled,
      style: this.url ? ButtonStyles.Link : this.style,
      custom_id: this.customId!,
      url: this.url!
    }
  }
}
