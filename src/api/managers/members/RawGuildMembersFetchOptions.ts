export interface RawGuildMembersFetchOptions {
  guild_id: string
  query?: string
  limit: number
  presences?: boolean
  user_ids?: string | string[]
  nonce?: string
}
