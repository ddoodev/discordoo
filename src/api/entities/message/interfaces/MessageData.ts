import { UserData } from '@src/api/entities/user'

export interface MessageData {
  id: string
  channelId: string
  content?: string
  author?: UserData
}
