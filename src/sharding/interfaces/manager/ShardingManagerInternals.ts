export interface ShardingManagerInternals {
  rest: {
    allowed: number
    allowedResetAt: number
    invalid: number
    invalidResetAt: number
    locked: boolean
  }
  shards: number[]
  id: string
}
