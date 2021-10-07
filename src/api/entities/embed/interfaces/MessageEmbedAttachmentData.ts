export interface MessageEmbedAttachmentData {
  url: string
  proxyUrl?: string
  height?: number
  width?: number
}

export type MessageEmbedThumbnailData = MessageEmbedAttachmentData
export type MessageEmbedVideoData = MessageEmbedAttachmentData
export type MessageEmbedImageData = MessageEmbedAttachmentData
