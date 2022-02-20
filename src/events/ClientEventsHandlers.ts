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
import { IpcMessageEventContext } from '@src/events/ctx/IpcMessageEventContext'
import { ExitingEventContext } from '@src/events/interfaces/ExitingEventContext'
import { RestructuringEventContext } from '@src/events/interfaces/RestructuringEventContext'
import { ThreadMembersUpdateEventContext, ThreadMemberUpdateEventContext } from '@src/events/thread'
import { GuildEmojisUpdatedEventContext } from '@src/events/emoji/ctx/GuildEmojisUpdatedEventContext'

/** Client events */
export interface ClientEventsHandlers {

  /** Emitted once when the client is ready */
  ready: (context: ReadyEventContext) => any

  /** Emitted when client receives message from another sharding instance through ipc */
  ipcMessage: (context: IpcMessageEventContext) => any

  /** The client disconnects from the gateway and will destroy the process after a few milliseconds */
  exiting: (context: ExitingEventContext) => any

  /** The client disconnects from the gateway and connects again with new shards configuration */
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

  /** Thread member for the client was updated */
  threadMemberUpdate: (context: ThreadMemberUpdateEventContext) => any

  /** Some user(s) were added to or removed from a thread */
  threadMembersUpdate: (context: ThreadMembersUpdateEventContext) => any

  /** Client joined a new guild */
  // guildCreate: (context: ChannelCreateEventContext) => any

  /** Guild was updated */
  // guildUpdate: (context: ChannelCreateEventContext) => any

  /** Client left/was removed from a guild */
  // guildDelete: (context: ChannelCreateEventContext) => any

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
  // guildMemberAdd: (context: ChannelCreateEventContext) => any

  /** User was removed from a guild */
  // guildMemberRemove: (context: ChannelCreateEventContext) => any

  /** Guild member was updated */
  // guildMemberUpdate: (context: ChannelCreateEventContext) => any

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
  // interactionCreate: (context: ChannelCreateEventContext) => any

  /** Invite to a channel was created */
  // inviteCreate: (context: ChannelCreateEventContext) => any

  /** Invite to a channel was deleted  */
  // inviteDelete: (context: ChannelCreateEventContext) => any

  /** Message was created */
  messageCreate: (context: MessageCreateEventContext) => any

  /** Message was updated */
  // messageUpdate: (context: MessageCreateEventContext) => any

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
  // userUpdate: (context: PresenceUpdateEventContext) => any

  /** Someone joined, left, or moved a voice channel */
  // voiceStateUpdate: (context: PresenceUpdateEventContext) => any

  /** Guild channel webhook was created, updated, or deleted */
  // webhooksUpdate: (context: PresenceUpdateEventContext) => any

}
