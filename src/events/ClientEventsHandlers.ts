import { MessageCreateEventContext } from '@src/events/ctx/MessageCreateEventContext'
import { PresenceUpdateEventContext } from '@src/events/ctx/PresenceUpdateEventContext'

/** Client events */
export interface ClientEventsHandlers {

  /** Emitted once when the client is ready */
  ready: () => unknown

  /** Emitted when someone created message */
  messageCreate: (context: MessageCreateEventContext) => unknown

  /** Emitted when someone's presence was updated */
  presenceUpdate: (context: PresenceUpdateEventContext) => unknown

}
