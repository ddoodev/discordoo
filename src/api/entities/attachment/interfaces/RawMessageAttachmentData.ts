export interface RawMessageAttachmentData {
  filename: string
  id: string
  content_type?: string
  size: number
  url: string
  proxy_url: string
  height?: number
  width?: number
  ephemeral?: boolean
}
