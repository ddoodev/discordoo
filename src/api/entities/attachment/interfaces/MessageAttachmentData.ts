import { BufferResolvable } from '@src/api/entities/interfaces/BufferResolvable'

export interface MessageAttachmentData {
  attachment: BufferResolvable
  name?: string
  id?: string
  size?: number
  url?: string
  proxy_url?: string
  height?: number
  width?: number
}
