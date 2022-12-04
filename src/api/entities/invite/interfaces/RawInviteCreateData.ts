export interface RawInviteCreateData {
  max_age?: number
  max_uses?: number
  temporary?: boolean
  unique?: boolean
  target_type?: number
  target_user_id?: string
  target_application_id?: string
}