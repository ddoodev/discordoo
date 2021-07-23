/** Operation Codes used in Inter-process communication messages */
export enum IpcOpCodes {
  /** Includes common event (t) (send/receive) */
  DISPATCH,
  /** IPC Server should send this to identify itself in IPC Client (send) */
  IDENTIFY,
  /** IPC Server / IPC Client sends this to each other to identify that they are alive (send/receive) */
  HEARTBEAT,
  /** IPC Server sends this to IPC Client when IPC Client id (ddoo snowflake) is invalid (send) */
  INVALID_SESSION,
  /** IPC Client sends this to IPC Server to explain to him who he is. Contains shards list, heartbeat interval (receive) */
  HELLO,
  /** Used to cache operating across shards (send/receive) */
  CACHE_OPERATE,
  /** Looks like something went wrong (send/receive) */
  ERROR,
}
