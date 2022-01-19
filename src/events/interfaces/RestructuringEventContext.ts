export interface RestructuringEventContext {
  /** New shards that this client will serve */
  shards: number[]
  /** New total shards amount */
  totalShards: number
}