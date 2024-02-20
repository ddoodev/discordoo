import { AbstractApplicationEventsHandlers } from '@src/events/apps/AbstractApplicationEventsHandlers'
import { GatewayReceivePayloadLike } from '@discordoo/providers'
import {
  ChannelCreateEventContext,
  ChannelDeleteEventContext,
  ChannelPinsUpdateEventContext,
  ChannelUpdateEventContext,
  GuildEmojisUpdatedEventContext,
  GuildMemberAddEventContext,
  GuildMemberRemoveEventContext,
  GuildMembersChunkEventContext,
  GuildMemberUpdateEventContext,
  InviteCreateEventContext,
  InviteDeleteEventContext,
  MessageCreateEventContext,
  PresenceUpdateEventContext,
  RestructuringEventContext,
  ShardConnectedEventContext,
  ThreadCreateEventContext,
  ThreadDeleteEventContext,
  ThreadListSyncEventContext,
  ThreadMembersUpdateEventContext,
  ThreadMemberUpdateEventContext,
  ThreadUpdateEventContext,
  UserUpdateEventContext,
  GuildCreateEventContext,
  GuildDeleteEventContext,
  GuildUpdateEventContext,
  InteractionCreateEventContext,
  MessageUpdateEventContext
} from '@src/events'

export interface GatewayApplicationEventsHandlers extends AbstractApplicationEventsHandlers {
  /** All raw WebSocket events */
  raw: (packet: GatewayReceivePayloadLike) => void
  /** The app disconnects from the gateway and connects again with new shards configuration */
  restructuring: (context: RestructuringEventContext) => any

  /** Gateway shard connected and received expected guilds (or a guilds receiving timeout) */
  shardConnected: (context: ShardConnectedEventContext) => any

  /** New guild channel created */
  channelCreate: (context: ChannelCreateEventContext) => any

  /** Channel was updated */
  channelUpdate: (context: ChannelUpdateEventContext) => any

  /** Channel was deleted */
  channelDelete: (context: ChannelDeleteEventContext) => any

  /** Message was pinned or unpinned */
  channelPinsUpdate: (context: ChannelPinsUpdateEventContext) => any

  /** Thread created, also sent when being added to a private thread */
  threadCreate: (context: ThreadCreateEventContext) => any

  /** Thread was updated */
  threadUpdate: (context: ThreadUpdateEventContext) => any

  /** Thread was deleted */
  threadDelete: (context: ThreadDeleteEventContext) => any

  /** Sent when gaining access to a channel, contains all active threads in that channel */
  threadListSync: (context: ThreadListSyncEventContext) => any

  /** Thread member for the app was updated */
  threadMemberUpdate: (context: ThreadMemberUpdateEventContext) => any

  /** Some user(s) were added to or removed from a thread */
  threadMembersUpdate: (context: ThreadMembersUpdateEventContext) => any

  /** DiscordApplication joined a new guild or unavailable guild became available */
  guildCreate: (context: GuildCreateEventContext) => any

  /** Guild was updated */
  guildUpdate: (context: GuildUpdateEventContext) => any

  /** DiscordApplication left/was removed from a guild or guild became unavailable */
  guildDelete: (context: GuildDeleteEventContext) => any

  /** User was banned from a guild */
  // guildBanAdd: (context: ChannelCreateEventContext) => any

  /** User was unbanned from a guild */
  // guildBanRemove: (context: ChannelCreateEventContext) => any

  /** Guild emojis were updated */
  guildEmojisUpdate: (context: GuildEmojisUpdatedEventContext) => any

  /** Guild stickers were updated */
  // guildStickersUpdate: (context: ChannelCreateEventContext) => any

  /** Guild integration was updated */
  // guildIntegrationsUpdate: (context: ChannelCreateEventContext) => any

  /** New user joined a guild */
  guildMemberAdd: (context: GuildMemberAddEventContext) => any

  /** User was removed from a guild */
  guildMemberRemove: (context: GuildMemberRemoveEventContext) => any

  /** Guild member was updated */
  guildMemberUpdate: (context: GuildMemberUpdateEventContext) => any

  /** Response to [Request Guild Members](https://discord.com/developers/docs/topics/gateway#request-guild-members) */
  guildMembersChunk: (context: GuildMembersChunkEventContext) => any

  /** Guild role was created */
  // guildRoleCreate: (context: ChannelCreateEventContext) => any

  /** Guild role was updated */
  // guildRoleUpdate: (context: ChannelCreateEventContext) => any

  /** Guild role was deleted */
  // guildRoleDelete: (context: ChannelCreateEventContext) => any

  /** Guild integration was created */
  // integrationCreate: (context: ChannelCreateEventContext) => any

  /** Guild integration was updated */
  // integrationUpdate: (context: ChannelCreateEventContext) => any

  /** Guild integration was deleted */
  // integrationDelete: (context: ChannelCreateEventContext) => any

  /** User used an interaction */
  interactionCreate: (context: InteractionCreateEventContext) => any

  /** Invite to a channel was created */
  inviteCreate: (context: InviteCreateEventContext) => any

  /** Invite to a channel was deleted  */
  inviteDelete: (context: InviteDeleteEventContext) => any

  /** Message was created */
  messageCreate: (context: MessageCreateEventContext) => any

  /** Message was updated */
  messageUpdate: (context: MessageUpdateEventContext) => any

  /** Message was deleted */
  // messageDelete: (context: MessageCreateEventContext) => any

  /** Multiple messages were deleted at once */
  // messageDeleteBulk: (context: MessageCreateEventContext) => any

  /** User reacted to a message */
  // messageReactionAdd: (context: MessageCreateEventContext) => any

  /** User removed a reaction from a message */
  // messageReactionRemove: (context: MessageCreateEventContext) => any

  /** All reactions were explicitly removed from a message */
  // messageReactionRemoveAll: (context: MessageCreateEventContext) => any

  /** All reactions for a given emoji were explicitly removed from a message */
  // messageReactionRemoveEmoji: (context: MessageCreateEventContext) => any

  /** Presence was updated */
  presenceUpdate: (context: PresenceUpdateEventContext) => any

  /** Stage instance was created */
  // stageInstanceCreate: (context: PresenceUpdateEventContext) => any

  /** Stage instance was updated */
  // stageInstanceUpdate: (context: PresenceUpdateEventContext) => any

  /** Stage instance was deleted or closed */
  // stageInstanceDelete: (context: PresenceUpdateEventContext) => any

  /** User started typing in a channel */
  // typingStart: (context: PresenceUpdateEventContext) => any

  /** Properties about the user changed */
  userUpdate: (context: UserUpdateEventContext) => any

  /** Someone joined, left, or moved a voice channel */
  // voiceStateUpdate: (context: PresenceUpdateEventContext) => any

  /** Guild channel webhook was created, updated, or deleted */
  // webhooksUpdate: (context: PresenceUpdateEventContext) => any
}