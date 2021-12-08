/** Operation Codes used in inter-process communication messages */
export enum IpcOpCodes {
  /** Includes common event (t) */
  DISPATCH,
  /** IPC Server should send this to identify itself in IPC Client */
  IDENTIFY,
  /** IPC Server / IPC Client sends this to each other to identify that they are alive */
  HEARTBEAT,
  /** IPC Client/Server replies with this when security token in request is invalid */
  INVALID_SESSION,
  /** IPC Client sends this to IPC Server to explain to him who he is. Contains shards list, heartbeat interval */
  HELLO,
  /** Used to cache operating across shards */
  CACHE_OPERATE,
  /** Looks like something went wrong */
  ERROR,
  /** Something urgent is happening. We need to react now. */
  EMERGENCY,
}
