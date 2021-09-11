import { UserData } from '@src/api/entities/user'

export interface MessageData {
  id: string
  channel_id: string
  content: string | null
  author: UserData | null
}
