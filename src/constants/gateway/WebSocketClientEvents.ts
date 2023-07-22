export enum WebSocketClientEvents {
  WsSendError = 'WsSendError',
  WsOpenError = 'WsOpenError',
  WsCloseError = 'WsCloseError',

  WsError = 'WsError',
  WsOpen = 'WsOpen',
  WsClosed = 'WsClosed',

  ReconnectMe = '__DDOO_RECONNECT_ME__',
  Connected = '__DDOO_CONNECTED__',

  Ready = 'ready',
  Resumed = 'resumed',
  Destroyed = 'destroyed',
  InvalidSession = 'invalidSession',
}
