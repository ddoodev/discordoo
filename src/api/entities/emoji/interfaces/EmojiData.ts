import { RoleResolvable } from '@src/api/entities/role'
import { UserResolvable } from '@src/api/entities/user/interfaces/UserResolvable'

export interface EmojiData {
  id: string | null
  name: string | null
  roles?: RoleResolvable[]
  user?: UserResolvable
  requireColons?: boolean
  managed?: boolean
  animated?: boolean
  available?: boolean
  userId?: string
}
