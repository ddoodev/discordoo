import {IntegrationExpireBehavior} from 'discord-api-types'

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

export enum Intents {
  GUILDS = 1 << 0,
  GUILD_MEMBERS = 1 << 1,
  GUILD_BANS = 1 << 2,
  GUILD_EMOJIS = 1 << 3,
  GUILD_INTEGRATIONS = 1 << 4,
  GUILD_WEBHOOKS = 1 << 5,
  GUILD_INVITES = 1 << 6,
  GUILD_VOICE_STATES = 1 << 7,
  GUILD_PRESENCES = 1 << 8,
  GUILD_MESSAGES = 1 << 9,
  GUILD_MESSAGE_REACTIONS = 1 << 10,
  GUILD_MESSAGE_TYPING = 1 << 11,
  DIRECT_MESSAGES = 1 << 12,
  DIRECT_MESSAGE_REACTIONS = 1 << 13,
  DIRECT_MESSAGE_TYPING = 1 << 14
}

export default class Constants {

  static Statuses = Statuses
  static WSCodes = WSCodes
  static Intents = Intents

}
