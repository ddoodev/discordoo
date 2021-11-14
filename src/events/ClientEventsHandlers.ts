import { MessageCreateEventContext } from '@src/events/ctx/MessageCreateEventContext'
import { PresenceUpdateEventContext } from '@src/events/ctx/PresenceUpdateEventContext'
import { GuildMembersChunkEventContext } from '@src/events/ctx'
import { ShardConnectedEventContext } from '@src/events/ctx/ShardConnectedEventContext'
import { ReadyEventContext } from '@src/events/ctx/ReadyEventContext'
import { ChannelCreateEventContext } from '@src/events/channel/ctx/ChannelCreateEventContext'
import { ChannelUpdateEventContext } from '@src/events/channel/ctx/ChannelUpdateEventContext'
import { ChannelDeleteEventContext } from '@src/events/channel/ctx/ChannelDeleteEventContext'
import { ChannelPinsUpdateEventContext } from '@src/events/channel/ctx/ChannelPinsUpdateEventContext'
import { ThreadCreateEventContext } from '@src/events/thread/ctx/ThreadCreateEventContext'
import { ThreadUpdateEventContext } from '@src/events/thread/ctx/ThreadUpdateEventContext'
import { ThreadDeleteEventContext } from '@src/events/thread/ctx/ThreadDeleteEventContext'
import { ThreadListSyncEventContext } from '@src/events/thread/ctx/ThreadListSyncEventContext'

/** Client events */
export interface ClientEventsHandlers {

  /** Emitted once when the client is ready */
  ready: (context: ReadyEventContext) => unknown

  /** Gateway shard connected and received expected guilds (or a guilds receiving timeout) */
  shardConnected: (context: ShardConnectedEventContext) => unknown

  /** New guild channel created */
  channelCreate: (context: ChannelCreateEventContext) => unknown

  /** Channel was updated */
  channelUpdate: (context: ChannelUpdateEventContext) => unknown

  /** Channel was deleted */
  channelDelete: (context: ChannelDeleteEventContext) => unknown

  /** Message was pinned or unpinned */
  channelPinsUpdate: (context: ChannelPinsUpdateEventContext) => unknown

  /** Thread created, also sent when being added to a private thread */
  threadCreate: (context: ThreadCreateEventContext) => unknown

  /** Thread was updated */
  threadUpdate: (context: ThreadUpdateEventContext) => unknown

  /** Thread was deleted */
  threadDelete: (context: ThreadDeleteEventContext) => unknown

  /** Sent when gaining access to a channel, contains all active threads in that channel */
  threadListSync: (context: ThreadListSyncEventContext) => unknown

  /** Thread member for the client was updated */
  threadMemberUpdate: (context: ChannelCreateEventContext) => unknown

  /** Some user(s) were added to or removed from a thread */
  threadMembersUpdate: (context: ChannelCreateEventContext) => unknown

  /** Client joined a new guild */
  guildCreate: (context: ChannelCreateEventContext) => unknown

  /** Guild was updated */
  guildUpdate: (context: ChannelCreateEventContext) => unknown

  /** Client left/was removed from a guild */
  guildDelete: (context: ChannelCreateEventContext) => unknown

  /** User was banned from a guild */
  guildBanAdd: (context: ChannelCreateEventContext) => unknown

  /** User was unbanned from a guild */
  guildBanRemove: (context: ChannelCreateEventContext) => unknown

  /** Guild emojis were updated */
  guildEmojisUpdate: (context: ChannelCreateEventContext) => unknown

  /** Guild stickers were updated */
  guildStickersUpdate: (context: ChannelCreateEventContext) => unknown

  /** Guild integration was updated */
  guildIntegrationsUpdate: (context: ChannelCreateEventContext) => unknown

  /** New user joined a guild */
  guildMemberAdd: (context: ChannelCreateEventContext) => unknown

  /** User was removed from a guild */
  guildMemberRemove: (context: ChannelCreateEventContext) => unknown

  /** Guild member was updated */
  guildMemberUpdate: (context: ChannelCreateEventContext) => unknown

  /** Response to [Request Guild Members](https://discord.com/developers/docs/topics/gateway#request-guild-members) */
  guildMembersChunk: (context: GuildMembersChunkEventContext) => unknown

  /** Guild role was created */
  guildRoleCreate: (context: ChannelCreateEventContext) => unknown

  /** Guild role was updated */
  guildRoleUpdate: (context: ChannelCreateEventContext) => unknown

  /** Guild role was deleted */
  guildRoleDelete: (context: ChannelCreateEventContext) => unknown

  /** Guild integration was created */
  integrationCreate: (context: ChannelCreateEventContext) => unknown

  /** Guild integration was updated */
  integrationUpdate: (context: ChannelCreateEventContext) => unknown

  /** Guild integration was deleted */
  integrationDelete: (context: ChannelCreateEventContext) => unknown

  /** User used an interaction */
  interactionCreate: (context: ChannelCreateEventContext) => unknown

  /** Invite to a channel was created */
  inviteCreate: (context: ChannelCreateEventContext) => unknown

  /** Invite to a channel was deleted  */
  inviteDelete: (context: ChannelCreateEventContext) => unknown

  /** Message was created */
  messageCreate: (context: MessageCreateEventContext) => unknown

  /** Message was updated */
  messageUpdate: (context: MessageCreateEventContext) => unknown

  /** Message was deleted */
  messageDelete: (context: MessageCreateEventContext) => unknown

  /** Multiple messages were deleted at once */
  messageDeleteBulk: (context: MessageCreateEventContext) => unknown

  /** User reacted to a message */
  messageReactionAdd: (context: MessageCreateEventContext) => unknown

  /** User removed a reaction from a message */
  messageReactionRemove: (context: MessageCreateEventContext) => unknown

  /** All reactions were explicitly removed from a message */
  messageReactionRemoveAll: (context: MessageCreateEventContext) => unknown

  /** All reactions for a given emoji were explicitly removed from a message */
  messageReactionRemoveEmoji: (context: MessageCreateEventContext) => unknown

  /** Presence was updated */
  presenceUpdate: (context: PresenceUpdateEventContext) => unknown

  /** Stage instance was created */
  stageInstanceCreate: (context: PresenceUpdateEventContext) => unknown

  /** Stage instance was updated */
  stageInstanceUpdate: (context: PresenceUpdateEventContext) => unknown

  /** Stage instance was deleted or closed */
  stageInstanceDelete: (context: PresenceUpdateEventContext) => unknown

  /** User started typing in a channel */
  typingStart: (context: PresenceUpdateEventContext) => unknown

  /** Properties about the user changed */
  userUpdate: (context: PresenceUpdateEventContext) => unknown

  /** Someone joined, left, or moved a voice channel */
  voiceStateUpdate: (context: PresenceUpdateEventContext) => unknown

  /** Guild channel webhook was created, updated, or deleted */
  webhooksUpdate: (context: PresenceUpdateEventContext) => unknown

}
