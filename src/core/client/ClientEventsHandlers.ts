import { Message } from '@src/api/entities/message/Message'

/** Client events */
export interface ClientEventsHandlers {

  /** Emitted once the client is ready */
  ready: () => unknown

  messageCreate: (msg: Message) => unknown

}
