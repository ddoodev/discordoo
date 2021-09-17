import { MessageEmbedData } from '@src/api/entities/embed/interfaces/MessageEmbedData'
import { is } from 'typescript-is'
import { ValidationError } from '@src/utils'
import { MessageEmbedTypes } from '@src/constants'
import { MessageEmbedFieldData } from '@src/api/entities/embed/interfaces/MessageEmbedFieldData'
import { MessageEmbedAuthorData } from '@src/api/entities/embed/interfaces/MessageEmbedAuthorData'
import {
  MessageEmbedImageData,
  MessageEmbedThumbnailData,
  MessageEmbedVideoData
} from '@src/api/entities/embed/interfaces/MessageEmbedAttachmentData'
import { MessageEmbedFooterData } from '@src/api/entities/embed/interfaces/MessageEmbedFooterData'

export class MessageEmbed {
  public type = MessageEmbedTypes.RICH
  public title?: string
  public description?: string
  public url?: string
  public timestamp?: number | Date
  public color?: string
  public fields: MessageEmbedFieldData[] = []
  public author?: MessageEmbedAuthorData
  public thumbnail?: MessageEmbedThumbnailData
  public image?: MessageEmbedImageData
  public video?: MessageEmbedVideoData
  public footer?: MessageEmbedFooterData

  constructor(data: MessageEmbedData | MessageEmbed = {}) {
    if (!is<MessageEmbedData>(data) || !(data instanceof this.constructor)) {
      throw new ValidationError('MessageEmbed', 'Incorrect message embed data:', data)
    }


  }

}
