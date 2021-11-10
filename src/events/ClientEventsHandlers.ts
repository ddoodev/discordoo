import { MessageCreateEventContext } from '@src/events/ctx/MessageCreateEventContext'
import { PresenceUpdateEventContext } from '@src/events/ctx/PresenceUpdateEventContext'
import { GuildMembersChunkEventContext } from '@src/events/ctx'

/** Client events */
export interface ClientEventsHandlers {

  /** Emitted once when the client is ready */
  ready: () => unknown

  /** Emitted when someone created message */
  messageCreate: (context: MessageCreateEventContext) => unknown

  /** Emitted when someone's presence was updated */
  presenceUpdate: (context: PresenceUpdateEventContext) => unknown

  /** Emitted when discord sends new chunk of requested members */
  guildMembersChunk: (context: GuildMembersChunkEventContext) => unknown

}
