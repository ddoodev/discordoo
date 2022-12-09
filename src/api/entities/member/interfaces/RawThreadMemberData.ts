export interface RawThreadMemberData {
  // IN Raw DATA THIS PROPERTY IS NULLABLE.
  id: string
  // IN Raw DATA THIS PROPERTY IS NULLABLE.
  user_id: string
  join_timestamp: string
  flags: number
  // Discord DOES NOT RETURN THIS PROPERTY.
  guild_id: string
}
