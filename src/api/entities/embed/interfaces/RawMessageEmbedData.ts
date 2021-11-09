import { MessageEmbedTypes } from '@src/constants'

export interface RawMessageEmbedData {
  type?: MessageEmbedTypes
  title?: string
  description?: string
  url?: string
  timestamp?: string
  color?: number
  fields?: { name: string; value: string; inline: boolean }[]
  author?: {
    name: string
    url?: string
    icon_url?: string
    proxy_icon_url?: string
  }
  thumbnail?: {
    url: string
    proxy_url?: string
    height?: number
    width?: number
  }
  image?: {
    url: string
    proxy_url?: string
    height?: number
    width?: number
  }
  video?: {
    url: string
    proxy_url?: string
    height?: number
    width?: number
  }
  footer?: {
    text: string
    icon_url?: string
    proxy_icon_url?: string
  }
  provider?: {
    name?: string
    url?: string
  }
}
