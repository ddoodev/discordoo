import { RoleResolvable } from '@src/api/entities/role'
import { UserResolvable } from '@src/api/entities/user/interfaces/UserResolvable'

export interface RawEmojiData {
  id: string | null
  name: string | null
  roles?: RoleResolvable[]
  user?: UserResolvable
  require_colons?: boolean
  managed?: boolean
  animated?: boolean
  available?: boolean
}
