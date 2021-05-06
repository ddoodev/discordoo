import { TypedEmitter } from 'tiny-typed-emitter'
import WebSocketShardEvents from '@src/websocket/WebSocketShardEvents'
import WebSocketManager from '@src/websocket/WebSocketManager'
import WebSocket from 'ws'
import WebSocketUtils from '@src/util/WebSocketUtils'
import { Constants } from '@src/core'

export default class WebSocketShard extends TypedEmitter<WebSocketShardEvents> {
  public manager: WebSocketManager
  public id: number

  public lastPingTimestamp = 0
  public ping = -1

  private connection?: WebSocket
  private sessionID?: string
  private sequence = -1
  private pendingGuilds: string[] = []
  private heartbeatInterval?: any
  private lastHeartbeatAcked = true

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
    let { data } = event,
      packet: Record<any, any>

    if (data instanceof ArrayBuffer) data = new Uint8Array(data)

    console.log('shard', this.id, 'message', data)

    try {
      packet = WebSocketUtils.unpack(data)

      this.handlePacket(packet)
    } catch (e) {
      console.error('shard', this.id, 'error', e)
    }

  }

  private handlePacket(packet?: Record<any, any>) {
    if (!packet) return
    console.log('shard', this.id, 'packet', packet)
    if (WebSocketUtils.exists(packet.s) && packet.s > this.sequence) this.sequence = packet.s

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
        this.setupHeartbeatInterval(packet.d.heartbeat_interval)
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

    this.connection.send(WebSocketUtils.pack(data), err => {
      if (err) console.error(err)
    })
  }

  private heartbeat() {
    console.log('shard', this.id, 'heartbeat', this.sequence)

    if (!this.lastHeartbeatAcked) {
      console.log('shard', this.id, 'last heartbeat didnt acked, reconnecting')
      return
    }

    this.lastPingTimestamp = Date.now()
    this.send({ op: Constants.OPCodes.HEARTBEAT, d: this.sequence })
  }

  private ackHeartbeat() {
    this.lastHeartbeatAcked = true
    this.ping = Date.now() - this.lastPingTimestamp
    console.log('shard', this.id, 'ack heartbeat', this.ping + 'ms')
  }

  private setupHeartbeatInterval(interval: number) {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (interval !== -1) this.heartbeatInterval = setInterval(this.heartbeat.bind(this), interval)
  }

  public destroy({ code = 1000, reset = false } = {}) {

    this.setupHeartbeatInterval(-1)

    if (this.connection) {
      if (this.connection.readyState === Constants.WebSocketStates.OPEN) {
        this.connection.close(code)
      } else {
        this.removeListeners()
      }
    }

    if (reset) {
      this.sequence = -1
      this.sessionID = undefined
    }

  }

  private removeListeners() {
    if (!this.connection) return

    // eslint-disable-next-line
    this.connection.onmessage = this.connection.onclose = this.connection.onerror = this.connection.onopen = () => {}
  }

}
