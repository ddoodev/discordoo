import { MessageEmbedData } from '@src/api'

export interface MessageEmbedBuilderData extends Omit<MessageEmbedData, 'thumbnail' | 'video' | 'image'> {
  thumbnail?: string
  video?: string
  image?: string
}
