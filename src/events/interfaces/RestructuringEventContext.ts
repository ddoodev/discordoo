export interface RestructuringEventContext {
  /** New shards that this app will serve */
  shards: number[]
  /** New total shards amount */
  totalShards: number
}