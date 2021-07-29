/** Inter-process communication events (t) */
export enum IpcEvents {
  /** Any messages between IPC Server and IPC Client */
  MESSAGE = 'MESSAGE',
  /** Emitted when ShardingInstance connected to Discord */
  CONNECTED = 'CONNECTED',
  /** Stop all shards */
  DESTROYING = 'DESTROYING',
  /** Set new shards configuration & restart (across machines only) */
  RESTRUCTURING = 'RESTRUCTURING',
  /** Restart all shards */
  RESTARTING = 'RESTARTING',
  /** Restart specified shards */
  PARTIAL_RESTARTING = 'PARTIAL_RESTARTING',
}
