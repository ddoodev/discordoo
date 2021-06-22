import { RESTOptions } from '@src/rest'
import { version } from '@root/package.json'
import WebSocketUtils from '@src/utils/WebSocketUtils'
import { GatewayOptions } from '@src/gateway'

export const RAW_IPC_EVENT = '__DDOO__.MESSAGE'

export enum DiscordooProviders {
  REST,
  GATEWAY,
  CACHE,
}

export enum IpcOPCodes {
  DISPATCH, // send/receive
  IDENTIFY, // send
  HEARTBEAT, // send/receive
  INVALID_SESSION, // send
  HELLO, // receive
  REQUEST_STATS, // send/receive
  ERROR, // send/receive
}

export enum IpcEvents {
  MESSAGE = 'MESSAGE',
  DESTROYING = 'DESTROYING', // stop all shards
  RESTRUCTURING = 'RESTRUCTURING', // set new shards configuration & restart (CROSS MACHINES ONLY)
  RESTARTING = 'RESTARTING', // restart all shards
  PARTIAL_RESTARTING = 'PARTIAL_RESTARTING', // restart specified shards
}

export enum ShardingModes {
  PROCESSES = 'processes',
  WORKERS = 'workers',
  CLUSTERS = 'clusters',
  MACHINES = 'machines',
}

export enum PartialShardingModes {
  PROCESSES = 'processes',
  WORKERS = 'workers',
  CLUSTERS = 'clusters',
}

export enum ShardingManagerTypes {
  STANDALONE_PARENT,
  STANDALONE_CHILD,
  PARENT,
  CHILD,
}

export enum WebSocketOPCodes {
  DISPATCH,
  HEARTBEAT,
  IDENTIFY,
  STATUS_UPDATE,
  VOICE_STATE_UPDATE,
  VOICE_GUILD_PING,
  RESUME,
  RECONNECT,
  REQUEST_GUILD_MEMBERS,
  INVALID_SESSION,
  HELLO,
  HEARTBEAT_ACK,
}

export enum WebSocketEvents {
  READY = 'READY',
  RESUMED = 'RESUMED',
  GUILD_CREATE = 'GUILD_CREATE',
  GUILD_DELETE = 'GUILD_DELETE',
  GUILD_UPDATE = 'GUILD_UPDATE',
  INVITE_CREATE = 'INVITE_CREATE',
  INVITE_DELETE = 'INVITE_DELETE',
  GUILD_MEMBER_ADD = 'GUILD_MEMBER_ADD',
  GUILD_MEMBER_REMOVE = 'GUILD_MEMBER_REMOVE',
  GUILD_MEMBER_UPDATE = 'GUILD_MEMBER_UPDATE',
  GUILD_MEMBERS_CHUNK = 'GUILD_MEMBERS_CHUNK',
  GUILD_INTEGRATIONS_UPDATE = 'GUILD_INTEGRATIONS_UPDATE',
  GUILD_ROLE_CREATE = 'GUILD_ROLE_CREATE',
  GUILD_ROLE_DELETE = 'GUILD_ROLE_DELETE',
  GUILD_ROLE_UPDATE = 'GUILD_ROLE_UPDATE',
  GUILD_BAN_ADD = 'GUILD_BAN_ADD',
  GUILD_BAN_REMOVE = 'GUILD_BAN_REMOVE',
  GUILD_EMOJIS_UPDATE = 'GUILD_EMOJIS_UPDATE',
  CHANNEL_CREATE = 'CHANNEL_CREATE',
  CHANNEL_DELETE = 'CHANNEL_DELETE',
  CHANNEL_UPDATE = 'CHANNEL_UPDATE',
  CHANNEL_PINS_UPDATE = 'CHANNEL_PINS_UPDATE',
  MESSAGE_CREATE = 'MESSAGE_CREATE',
  MESSAGE_DELETE = 'MESSAGE_DELETE',
  MESSAGE_UPDATE = 'MESSAGE_UPDATE',
  MESSAGE_DELETE_BULK = 'MESSAGE_DELETE_BULK',
  MESSAGE_REACTION_ADD = 'MESSAGE_REACTION_ADD',
  MESSAGE_REACTION_REMOVE = 'MESSAGE_REACTION_REMOVE',
  MESSAGE_REACTION_REMOVE_ALL = 'MESSAGE_REACTION_REMOVE_ALL',
  MESSAGE_REACTION_REMOVE_EMOJI = 'MESSAGE_REACTION_REMOVE_EMOJI',
  USER_UPDATE = 'USER_UPDATE',
  PRESENCE_UPDATE = 'PRESENCE_UPDATE',
  TYPING_START = 'TYPING_START',
  VOICE_STATE_UPDATE = 'VOICE_STATE_UPDATE',
  VOICE_SERVER_UPDATE = 'VOICE_SERVER_UPDATE',
  WEBHOOKS_UPDATE = 'WEBHOOKS_UPDATE',
}

export enum WebSocketStates {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

export enum WebSocketShardStatus {
  CREATED,
  READY,
  CONNECTING,
  RECONNECTING,
  CONNECTED,
  DISCONNECTED,
  WAITING_FOR_GUILDS,
  IDENTIFYING,
  RESUMING,
}

export enum WebSocketClientStates {
  CREATED,
  READY,
  CONNECTING,
  RECONNECTING,
  CONNECTED,
  DISCONNECTED,
  WAITING_FOR_GUILDS,
  IDENTIFYING,
  RESUMING,
}

export enum WebSocketClientEvents {
  WS_SEND_ERROR = 'WS_SEND_ERROR',
  WS_OPEN_ERROR = 'WS_OPEN_ERROR',
  WS_CLOSE_ERROR = 'WS_CLOSE_ERROR',

  WS_ERROR = 'WS_ERROR',
  WS_OPEN = 'WS_OPEN',
  WS_CLOSED = 'WS_CLOSED',

  RECONNECT_ME = 'RECONNECT_ME',

  READY = 'ready',
  RESUMED = 'resumed',
  DESTROYED = 'destroyed',
  INVALID_SESSION = 'invalidSession',
}

export enum WebSocketManagerStates {
  CREATED,
  CONNECTING,
  READY,
  DISCONNECTED,
}

export const WS_HANDSHAKE_TIMEOUT = 30000

export const API_ENDPOINT = 'https://discord.com/api'

export const DEFAULT_WS_OPTIONS: Omit<GatewayOptions, 'token'> = {
  properties: {
    $browser: 'Discordoo',
    $device: 'Discordoo',
    $os: process.platform
  },
  compress: false,
  intents: 32509, // use all intents except privileged
  maxShards: Infinity,
  version: 9,
  shards: 1,
  url: 'wss://gateway.discord.gg',
  spawnDelay: 5000,
  encoding: WebSocketUtils.encoding,
  useReconnectOnly: false,
  smoothEventsPeaks: false,
  eventPeaksSmoothingMultiplier: 2,
  maxEventsPerSecond: undefined
}

export const DEFAULT_REST_OPTIONS: RESTOptions = {
  v: 9,
  useragent: `DiscordBot (https://github.com/Discordoo/discordoo, ${version})`,
  maxRetries: 5
}
