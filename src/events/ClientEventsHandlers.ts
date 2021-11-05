import { MessageCreateEventContext } from '@src/events/ctx/MessageCreateEventContext'

/** Client events */
export interface ClientEventsHandlers {

  /** Emitted once when the client is ready */
  ready: () => unknown

  /** Emitted when someone created message */
  messageCreate: (context: MessageCreateEventContext) => unknown

}
