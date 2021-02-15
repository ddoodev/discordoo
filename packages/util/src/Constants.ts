export enum Statuses {
  READY = 0,
  CONNECTING = 1,
  RECONNECTING = 2,
  IDLE = 3,
  NEARLY = 4,
  DISCONNECTED = 5,
  WAITING_FOR_GUILDS = 6,
  IDENTIFYING = 7,
  RESUMING = 8,
}

export const WSCodes = {
  1000: 'WS_CLOSE_REQUESTED',
  4004: 'TOKEN_INVALID',
  4010: 'SHARDING_INVALID',
  4011: 'SHARDING_REQUIRED',
  4013: 'INVALID_INTENTS',
  4014: 'DISALLOWED_INTENTS',
}

export default class Constants {

  static Statuses = Statuses
  static WSCodes = WSCodes

}
