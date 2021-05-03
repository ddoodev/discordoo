import { TypedEmitter } from 'tiny-typed-emitter'
import WebSocketShardEvents from '@src/websocket/WebSocketShardEvents'
import WebSocketManager from '@src/websocket/WebSocketManager'

export default class WebSocketShard extends TypedEmitter<WebSocketShardEvents> {
  public manager: WebSocketManager
  public id: number

  constructor(manager: WebSocketManager, id: number) {
    super()

    this.manager = manager
    this.id = id
  }

}
