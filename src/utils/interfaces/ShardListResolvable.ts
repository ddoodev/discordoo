/** Represents a value that can be resolved to array of shard ids */
export type ShardListResolvable = number | number[] | { from: number; to: number }
