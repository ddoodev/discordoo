import { GatewayOPCodes } from 'discord-api-types'

export default interface ProtocolEvents {
  READY: Record<string, never>,
  GATEWAY_EVENT: {
    op: GatewayOPCodes,
    d?: Record<string, any>,
    s?: number,
    t?: string
  },
  DOWN: Record<string, never>,
  CACHE_REQUEST: {
    type: 'CHANNELS' | 'GUILD_EMOJIS' | 'GUILDS' | 'MEMBERS' | 'USERS' | 'PRESENCES' | 'MESSAGES',
    id: number,
    additional: number
  },
  CACHE_RESPONSE: {
    type: 'CHANNELS' | 'GUILD_EMOJIS' | 'GUILDS' | 'MEMBERS' | 'USERS' | 'PRESENCES' | 'MESSAGES',
    id: number,
    entries: [any, any][]
  },
  HELLO: {
    id: number,
    token: string
  }
}
