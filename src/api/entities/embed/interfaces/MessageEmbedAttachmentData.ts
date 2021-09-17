export interface MessageEmbedAttachmentData {
  url: string
  proxy_url?: string
  height?: number
  width?: number
}

export type MessageEmbedThumbnailData = MessageEmbedAttachmentData
export type MessageEmbedVideoData = MessageEmbedAttachmentData
export type MessageEmbedImageData = MessageEmbedAttachmentData
