export default interface WebSocketManagerLimits {
  events: {
    emittedLastSecond: number
    emittedThisSecond: number
    maximumPerSecond: number
    queue: any[]
  }
}
