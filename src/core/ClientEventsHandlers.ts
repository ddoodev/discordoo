/** Client events */
export default interface ClientEventsHandlers {
  /** Emitted once the client is ready */
  ready: () => unknown
}
