import { TypedEmitter } from 'tiny-typed-emitter'
import WebSocketShardEvents from '@src/websocket/WebSocketShardEvents'
import WebSocketManager from '@src/websocket/WebSocketManager'
import WebSocket from 'ws'
import WebSocketUtil from '@src/util/WebSocketUtil'
import { Constants } from '@src/core'

export default class WebSocketShard extends TypedEmitter<WebSocketShardEvents> {
  public manager: WebSocketManager
  public id: number

  private connection?: WebSocket
  private sessionID?: string
  private sequence = -1
  private lastPingTimestamp = 0
  private ping = -1
  private pendingGuilds: string[] = []

  constructor(manager: WebSocketManager, id: number) {
    super()

    this.manager = manager
    this.id = id
  }

  public async connect() {
    if (!this.manager.options.url) return false

    console.log('shard', this.id, 'creating websocket', this.manager.options.url)
    this.connection = new WebSocket(this.manager.options.url)

    console.log('shard', this.id, 'message subscribe')
    this.connection.onmessage = this.onMessage.bind(this)
  }

  private identify() {
    return this.sessionID ? this.resumeIdentify() : this.createIdentify()
  }

  private createIdentify() {
    const { token, intents, properties, presence, compress } = this.manager.options

    const d = {
      token,
      intents,
      properties,
      presence: presence || null,
      compress,
      shard: [ this.id, this.manager.totalShards ]
    }

    console.log('shard', this.id, 'idenfity', { op: Constants.OPCodes.IDENTIFY, d })

    return this.send({ op: Constants.OPCodes.IDENTIFY, d })
  }

  private resumeIdentify() {
    if (!this.sessionID) return this.identify()

    const d = {
      token: this.manager.options.token,
      session_id: this.sessionID,
      seq: this.sequence
    }

    return this.send({ op: Constants.OPCodes.RESUME, d })
  }

  private onMessage(event: WebSocket.MessageEvent) {
    const { data } = event
    console.log('shard', this.id, 'message', data)

    if (typeof data === 'string') {
      let packet: Record<any, any> | undefined
      try {
        packet = JSON.parse(data)
      } catch (e) {
        console.error(e)
      }

      console.log('shard', this.id, 'packet', packet)
      this.handlePacket(packet)
    }

  }

  private handlePacket(packet?: Record<any, any>) {
    if (!packet) return

    if (packet.s > this.sequence) this.sequence = packet.s

    switch (packet.t) {
      case Constants.WebSocketEvents.READY:
        this.sessionID = packet.d.session_id
        this.pendingGuilds = packet.d.guilds.map(g => g.id)
        this.heartbeat()
        break
    }

    switch (packet.op) {
      case Constants.OPCodes.HELLO:
        console.log('HELLO')
        this.identify()
        this.heartbeatInterval(packet.d.heartbeat_interval)
        break
      case Constants.OPCodes.HEARTBEAT:
        console.log('HEARTBEAT')
        this.heartbeat()
        break
      case Constants.OPCodes.HEARTBEAT_ACK:
        console.log('HEARTBEAT_ACK')
        this.ackHeartbeat()
        break
      default:

        break
    }
  }

  private send(data: any) {
    if (!this.connection) return

    this.connection.send(WebSocketUtil.pack(data), err => {
      if (err) console.error(err)
    })
  }

  private heartbeat() {
    console.log('shard', this.id, 'heartbeat', this.sequence)
    this.lastPingTimestamp = Date.now()
    this.send({ op: Constants.OPCodes.HEARTBEAT, d: this.sequence })
  }

  private ackHeartbeat() {
    this.ping = Date.now() - this.lastPingTimestamp
    console.log('shard', this.id, 'ack heartbeat', this.ping + 'ms')
  }

  private heartbeatInterval(interval: number) {
    setInterval(this.heartbeat.bind(this), interval)
  }

}
