import { WebSocketManagerOptions } from '@src/gateway/interfaces/WebSocketManagerOptions'

export interface IdentifyOptions extends WebSocketManagerOptions {
  forceResume?: boolean
}
