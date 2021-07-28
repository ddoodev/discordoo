export interface ShardingManagerInternals {
  rest: {
    requests: number
    invalid: number
  }
  shards: number[]
  id: string
}
