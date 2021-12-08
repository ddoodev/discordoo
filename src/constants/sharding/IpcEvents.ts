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
  /** Request guild members in guild from another shard / Request response (guild members array/error) */
  GUILD_MEMBERS_REQUEST = 'GUILD_MEMBERS_REQUEST',
  /** Eval script in specified shards */
  BROADCAST_EVAL = 'BROADCAST_EVAL',
  /** Rest rate limits synchronization request/response */
  REST_LIMITS_SYNC = 'REST_LIMITS_SYNC',
}
