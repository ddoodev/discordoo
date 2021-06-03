export default interface WebSocketShardLimits {
  requests: {
    queue: any[]
    sent: number
    resetTime: number
  }
}
