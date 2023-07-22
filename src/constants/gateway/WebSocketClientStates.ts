export enum WebSocketClientStates {
    Created = 0,
    Ready = 1,
    Connecting = 2,
    Reconnecting = 3,
    Connected = 4,
    Disconnected = 5,
    WaitingForGuilds = 6,
    Identifying = 7,
    Resuming = 8
}
