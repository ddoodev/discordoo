export enum WebSocketClientEvents {
  WS_SEND_ERROR = 'WS_SEND_ERROR',
  WS_OPEN_ERROR = 'WS_OPEN_ERROR',
  WS_CLOSE_ERROR = 'WS_CLOSE_ERROR',

  WS_ERROR = 'WS_ERROR',
  WS_OPEN = 'WS_OPEN',
  WS_CLOSED = 'WS_CLOSED',

  RECONNECT_ME = '__DDOO_RECONNECT_ME__',
  CONNECTED = '__DDOO_CONNECTED__',

  READY = 'ready',
  RESUMED = 'resumed',
  DESTROYED = 'destroyed',
  INVALID_SESSION = 'invalidSession',
}
