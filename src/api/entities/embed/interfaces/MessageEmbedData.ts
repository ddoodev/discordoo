import { MessageEmbedFieldData } from '@src/api/entities/embed/interfaces/MessageEmbedFieldData'
import { ColorResolvable } from '@src/api/entities/interfaces/ColorResolvable'
import { MessageEmbedAuthorData } from '@src/api/entities/embed/interfaces/MessageEmbedAuthorData'
import {
  MessageEmbedImageData,
  MessageEmbedThumbnailData,
  MessageEmbedVideoData
} from '@src/api/entities/embed/interfaces/MessageEmbedAttachmentData'
import { MessageEmbedFooterData } from '@src/api/entities/embed/interfaces/MessageEmbedFooterData'
import { MessageEmbedTypes } from '@src/constants'
import { MessageEmbedProviderData } from '@src/api/entities/embed/interfaces/MessageEmbedProviderData'

export interface MessageEmbedData {
  type?: MessageEmbedTypes
  title?: string
  description?: string
  url?: string
  timestamp?: number | Date
  color?: ColorResolvable
  fields?: MessageEmbedFieldData[]
  author?: MessageEmbedAuthorData
  thumbnail?: MessageEmbedThumbnailData
  image?: MessageEmbedImageData
  video?: MessageEmbedVideoData
  footer?: MessageEmbedFooterData
  provider?: MessageEmbedProviderData
}
