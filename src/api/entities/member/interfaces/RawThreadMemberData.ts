export interface RawThreadMemberData {
  // IN RAW DATA THIS PROPERTY IS NULLABLE.
  id: string
  // IN RAW DATA THIS PROPERTY IS NULLABLE.
  user_id: string
  join_timestamp: string
  flags: number
  // DISCORD DOES NOT RETURN THIS PROPERTY.
  guild_id: string
}
