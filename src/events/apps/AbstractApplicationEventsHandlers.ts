import { ExitingEventContext, IpcMessageEventContext, ReadyEventContext } from '@src/events'

export interface AbstractApplicationEventsHandlers {
  /** Emitted once when the app is ready */
  ready: (context: ReadyEventContext) => any

  /** Emitted when app receives message from another sharding instance through ipc */
  ipcMessage: (context: IpcMessageEventContext) => any

  /** Emitted when app receives message from another sharding instance through ipc and should destroy itself */
  exiting: (context: ExitingEventContext) => any
}