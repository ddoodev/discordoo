export interface InviteCreateData {
  maxAge?: number
  maxUses?: number
  temporary?: boolean
  unique?: boolean
  targetType?: number
  targetUserId?: string
  targetApplicationId?: string
}