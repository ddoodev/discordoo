import EventEmitter from 'events'
import WebSocketManager from './WebSocketManager'

export default class WebSocketShard extends EventEmitter {
  public manager: WebSocketManager
  public id: number

  constructor(manager: WebSocketManager, id: number) {
    super()

    this.manager = manager
    this.id = id
  }

}
