import { UserResolvable } from '@src/api'

export interface GuildMembersFetchOptions {
  // String that username starts with.
  query?: string
  // Maximum number of members to send matching the query; a limit of 0 can be used with an empty string query to return all members.
  limit?: number
  // Used to specify if we want the presences of the matched members.
  presences?: boolean
  // Used to specify which users you wish to fetch.
  users?: UserResolvable[] | UserResolvable
  // Nonce to identify the Guild Members Chunk response.
  nonce?: string
}
