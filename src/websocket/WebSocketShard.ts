import { TypedEmitter } from 'tiny-typed-emitter'
import WebSocketShardEvents from '@src/websocket/WebSocketShardEvents'
import WebSocketManager from '@src/websocket/WebSocketManager'
import WebSocket from 'ws'

export default class WebSocketShard extends TypedEmitter<WebSocketShardEvents> {
  public manager: WebSocketManager
  public id: number

  private connection?: WebSocket

  constructor(manager: WebSocketManager, id: number) {
    super()

    this.manager = manager
    this.id = id
  }

  public async connect() {

    if (!this.manager.options.url) return false

    this.connection = new WebSocket(this.manager.options.url)

    this.connection.on('message', this.onMessage.bind(this))

  }

  private onMessage(event: WebSocket.MessageEvent) {
    const { data } = event

    if (typeof data === 'string') {
      let packet: Record<any, any> | undefined
      try {
        packet = JSON.parse(data)
      } catch (e) {
        console.error(e)
      }

      this.processPacket(packet)
    }

  }

  private processPacket(packet?: Record<any, any>) {

    // runtime check
    if (!packet) return


  }

}
