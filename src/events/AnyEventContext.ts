import {
  ChannelCreateEventContext,
  ChannelDeleteEventContext,
  ChannelPinsUpdateEventContext,
  ChannelUpdateEventContext
} from '@src/events/channel'
import {
  GuildMembersChunkEventContext,
  IpcMessageEventContext,
  MessageCreateEventContext,
  PresenceUpdateEventContext,
  ReadyEventContext,
  ShardConnectedEventContext
} from '@src/events/ctx'
import {
  ExitingEventContext,
  RestructuringEventContext
} from '@src/events/interfaces'
import {
  ThreadCreateEventContext,
  ThreadDeleteEventContext,
  ThreadListSyncEventContext,
  ThreadUpdateEventContext
} from '@src/events/thread'

export type AnyEventContext = 
  ChannelCreateEventContext |
  ChannelDeleteEventContext |
  ChannelPinsUpdateEventContext |
  ChannelUpdateEventContext |
  GuildMembersChunkEventContext |
  IpcMessageEventContext |
  MessageCreateEventContext |
  PresenceUpdateEventContext |
  ReadyEventContext |
  ShardConnectedEventContext |
  ExitingEventContext |
  RestructuringEventContext |
  ThreadCreateEventContext |
  ThreadDeleteEventContext |
  ThreadListSyncEventContext |
  ThreadUpdateEventContext