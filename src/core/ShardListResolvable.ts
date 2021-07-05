/** Represents a shards list that can be resolved to array of shards ids */
export type ShardListResolvable = number | number[] | { from: number; to: number }
