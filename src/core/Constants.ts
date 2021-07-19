// import { RESTOptions } from '@src/rest'
import { version } from '@root/package.json'
import { WebSocketUtils } from '@src/utils/WebSocketUtils'
import { GatewayOptions } from '@src/gateway'

export const RAW_IPC_EVENT = '__DDOO__.MESSAGE'

/** Sharding more 'clusters' incompatible with Windows socket. Only UNIX socket supported. */
export const CLUSTERS_SHARDING_UNSUPPORTED_PLATFORMS = [
  'win32',
  'cygwin',
]

export enum RestRequestMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/** Global caching policy used to override any other caching policies */
export enum GlobalCachingPolicy {
  /** Cache everything we can */
  ALL = 'all',
  /** Cache absolutely nothing */
  NONE = 'none',
}

/** Messages caching policy */
export enum MessagesCachingPolicy {
  /** Cache all messages */
  ALL = 'all',
  /** Dont cache messages */
  NONE = 'none',
  /** Cache messages from users */
  USERS = 'users',
  /** Cache messages from bots */
  BOTS = 'bots',
}

/** Guilds caching policy */
export enum GuildsCachingPolicy {
  /** Cache all guilds */
  ALL = 'all',
  /** Dont cache guilds */
  NONE = 'none',
}

/** Members caching policy */
export enum MembersCachingPolicy {
  /** Cache all members which library received */
  ALL = 'all',
  /** Dont cache members */
  NONE = 'none',
  /** Cache online members */
  ONLINE = 'online',
  /** Cache members with dnd status */
  DND = 'dnd',
  /** Cache with idle status */
  IDLE = 'idle',
  /** Cache offline members */
  OFFLINE = 'offline',
  /** Cache guilds owners */
  OWNER = 'owner',
  /** Cache members which are pending due to discord's welcome screen */
  PENDING = 'pending',
  /** Cache connected to voice channels members */
  VOICE = 'voice',
  /** Cache members who recently send a message */
  RECENT_MESSAGE = 'recentMessage',
}

/** Channels caching policy */
export enum ChannelsCachingPolicy {
  /** Cache all channels */
  ALL = 'all',
  /** Dont cache channels */
  NONE = 'none',
  /** Cache text channels */
  TEXT = 'text',
  /** Cache voice channels (does not includes stages) */
  VOICE = 'voice',
  /** Cache dm channels */
  DM = 'dm',
  /** Cache categories */
  CATEGORY = 'category',
  /** Cache news channels (does not includes threads) */
  NEWS = 'news',
  /** Cache 'store' channels (does not includes threads) */
  STORE = 'store',
  /** Cache news threads */
  NEWS_THREAD = 'newsThread',
  /** Cache public threads */
  PUBLIC_THREAD = 'publicThread',
  /** Cache private threads */
  PRIVATE_THREAD = 'privateThread',
  /** Cache stage voices */
  STAGE_VOICE = 'stageVoice',
}

/** Emojis caching policy */
export enum EmojisCachingPolicy {
  /** Cache all emojis */
  ALL = 'all',
  /** Dont cache emojis */
  NONE = 'none',
  /** Cache animated emojis */
  ANIMATED = 'animated',
  /** Cache static emojis (common) */
  STATIC = 'static',
}

/** Roles caching policy */
export enum RolesCachingPolicy {
  /** Cache all roles */
  ALL = 'all',
  /** Dont cache roles */
  NONE = 'none',
  /** Cache @everyone roles */
  EVERYONE = 'everyone',
  /** Cache roles that managed by integrations */
  MANAGED = 'managed',
}

/** Presences caching policy */
export enum PresencesCachingPolicy {
  /** Cache all presences */
  ALL = 'all',
  /** Dont cache presences */
  NONE = 'none',
}

/** Users caching policy */
export enum UsersCachingPolicy {
  /** Cache all users */
  ALL = 'all',
  /** Dont cache users */
  NONE = 'none',
}

/** Providers that can be used in Discordoo */
export enum DiscordooProviders {
  REST,
  GATEWAY,
  CACHE,
}

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
  /** Used to statistics requests (send/receive) */
  REQUEST_STATS,
  /** Looks like something went wrong (send/receive) */
  ERROR,
}

/** Inter-process communication events (t) */
export enum IpcEvents {
  /** Any messages between IPC Server and IPC Client */
  MESSAGE = 'MESSAGE',
  /** Stop all shards */
  DESTROYING = 'DESTROYING',
  /** Set new shards configuration & restart (between machines only) */
  RESTRUCTURING = 'RESTRUCTURING',
  /** Restart all shards */
  RESTARTING = 'RESTARTING',
  /** Restart specified shards */
  PARTIAL_RESTARTING = 'PARTIAL_RESTARTING',
}

/** Sharding manager modes */
export const enum ShardingModes {
  /** Spawn sharding instances in different processes */
  PROCESSES = 'processes',
  /** Spawn sharding instances in different worker threads */
  WORKERS = 'workers',
  /** Spawn sharding instances in different node.js's clusters */
  CLUSTERS = 'clusters',
  /** Connect to child sharding managers in different machines and pass sharding instructions to them */
  MACHINES = 'machines',
}

/* Child sharding manager modes (used on a remote machines when 'machines' sharding mode is used) **/
export enum PartialShardingModes {
  /** Spawn sharding instances in different processes */
  PROCESSES = 'processes',
  /** Spawn sharding instances in different worker threads */
  WORKERS = 'workers',
  /** Spawn sharding instances in different node.js's clusters */
  CLUSTERS = 'clusters',
}

export enum WebSocketOpCodes {
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

export const DEFAULT_REST_OPTIONS: any /* RESTOptions */ = {
  v: 9,
  useragent: `DiscordBot (https://github.com/Discordoo/discordoo, ${version})`,
  maxRetries: 5
}
