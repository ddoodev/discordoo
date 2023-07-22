export enum WebSocketClientStates {
  Created,
  Ready,
  Connecting,
  Reconnecting,
  Connected,
  Disconnected,
  WaitingForGuilds,
  Identifying,
  Resuming,
}
