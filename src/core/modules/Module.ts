import Client from '../Client'

/** Represents a module */
export default interface Module {
  /** Whether the module was initialized */
  initialized: boolean
  /**
   * Function, which will be emitted once module was initialized on client's startup
   * @param client - client, the module will be bound to
   */
  init?: (client: Client) => Promise<void> | void
  /** Function, which will be emitted once module is destroyed */
  destroyed?: () => Promise<void> | void
  /** Unique id for this module */
  id: string | symbol
}