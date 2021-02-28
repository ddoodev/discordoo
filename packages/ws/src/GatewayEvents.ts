import { GatewayDispatchEvents, GatewayDispatchPayload } from 'discord-api-types'

export default interface GatewayEvents {
  CHANNEL_CREATE: GatewayDispatchEvents.ChannelCreate,
  CHANNEL_DELETE: GatewayDispatchEvents.ChannelDelete,
  CHANNEL_PINS_UPDATE: GatewayDispatchEvents.ChannelUpdate,
  CHANNEL_UPDATE: GatewayDispatchEvents.ChannelUpdate,
  GUILD_BANS_ADD: GatewayDispatchEvents.GuildBanAdd,
  GUILD_BAN_REMOVE: GatewayDispatchEvents.GuildBanRemove,
  GUILD_CREATE: GatewayDispatchEvents.GuildCreate,
  GUILD_DELETE: GatewayDispatchEvents.GuildDelete,
  GUILD_EMOJIS_UPDATE: GatewayDispatchEvents.GuildEmojisUpdate,
  GUILD_INTEGRATIONS_UPDATE: GatewayDispatchEvents.GuildIntegrationsUpdate,
  GUILD_MEMBER_ADD: GatewayDispatchEvents.GuildMemberAdd,
  GUILD_MEMBER_REMOVE: GatewayDispatchEvents.GuildMemberRemove,
  GUILD_MEMBERS_CHUNK: GatewayDispatchEvents.GuildMembersChunk,
  GUILD_MEMBER_UPDATE: GatewayDispatchEvents.GuildMemberUpdate,
  GUILD_ROLE_CREATE: GatewayDispatchEvents.GuildRoleCreate
}