import { TypedEmitter } from 'tiny-typed-emitter'
import { OPCodes, WebSocketEvents, WebSocketShardStatus, WebSocketStates } from '@src/core/Constants'
import WebSocketShardEvents from '@src/websocket/interfaces/WebSocketShardEvents'
import WebSocketManager from '@src/websocket/WebSocketManager'
import WebSocket from 'ws'
import WebSocketUtils from '@src/util/WebSocketUtils'
import WebSocketShardDestroyOptions from '@src/websocket/interfaces/WebSocketShardDestroyOptions'
import WebSocketShardLimits from '@src/websocket/interfaces/WebSocketShardLimits'
import wait from '@src/util/wait'
import DiscordooError from '@src/util/DiscordooError'
// @ts-ignore
import PakoTypes from '@types/pako'

export default class WebSocketShard extends TypedEmitter<WebSocketShardEvents> {
  public manager: WebSocketManager
  public id: number
  public status: WebSocketShardStatus

  public lastPingTimestamp = 0
  public ping = -1

  private limits: WebSocketShardLimits
  private expectedGuilds: string[] = []
  private inflate?: PakoTypes.Inflate

  private connection?: WebSocket
  private sessionID?: string
  private sequence = -1
  private heartbeatInterval?: any
  private missedHeartbeats = 0

  constructor(manager: WebSocketManager, id: number) {
    super()

    this.limits = {
      requests: {
        queue: [],
        sent: 0,
        resetTime: Date.now() + 60000 // 1 second
      }
    }

    this.status = WebSocketShardStatus.CREATED

    this.manager = manager
    this.id = id
  }

  public async connect() {
    if (!this.manager.options.url) return false

    if (this.connection?.readyState === WebSocketStates.OPEN && this.ready) {
      return Promise.resolve()
    }

    if (this.manager.options.compress && !this.sessionID) {
      if (!WebSocketUtils.pako) {
        throw new DiscordooError(
          'WebSocketShard ' + this.id,
          'gateway compression requires pako@1.0.11 module installed'
        )
      }

      this.inflate = new WebSocketUtils.pako.Inflate({
        chunkSize: 128 * 1024
      })
    }

    try {
      this.status = WebSocketShardStatus.CONNECTING

      console.log('shard', this.id, 'creating websocket', this.manager.options.url)
      this.connection = new WebSocket(this.manager.options.url)

      console.log('shard', this.id, 'message subscribe')
      this.connection.onmessage = this.onMessage.bind(this)
      this.connection.onclose = this.onClose.bind(this)
      this.connection.onopen = this.onOpen.bind(this)
    } catch (e) {
      this.status = WebSocketShardStatus.RECONNECTING
      console.error('shard', this.id, 'websocket creation failed. trying again in 15s. error:', e)
      await wait(15000)
      this.connect()
    }
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

    // console.log('shard', this.id, 'identity', { op: OPCodes.IDENTIFY, d })

    return this.send({ op: OPCodes.IDENTIFY, d })
  }

  private resumeIdentify() {
    if (!this.sessionID) return this.identify()
    this.status = WebSocketShardStatus.RESUMING

    const d = {
      token: this.manager.options.token,
      session_id: this.sessionID,
      seq: this.sequence
    }

    return this.send({ op: OPCodes.RESUME, d })
  }

  private onOpen() {
    this.status = WebSocketShardStatus.CONNECTED

    this.emit('connected')
  }

  private onClose(event: WebSocket.CloseEvent) {
    if (event.code === 1000) {
      this.emit('invalidated')
    }

    this.emit('closed')
    this.removeListeners()
  }

  private onMessage(event: WebSocket.MessageEvent) {
    let { data } = event,
      packet: Record<any, any>

    if (data instanceof ArrayBuffer) data = new Uint8Array(data)

    if (Array.isArray(data)) data = Buffer.concat(data)

    if (
      this.manager.options.compress
      && data instanceof Uint8Array
      && this.inflate
    ) {
      const l = data.length
      const flush = l >= 4
        && data[l - 4] === 0x00
        && data[l - 3] === 0x00
        && data[l - 2] === 0xff
        && data[l - 1] === 0xff


      this.inflate.push(data, flush ? WebSocketUtils.pako.Z_SYNC_FLUSH : false)
      if (!flush) return
      const decompressed = this.inflate.result

      if (!decompressed) return

      if (decompressed instanceof Uint8Array || Array.isArray(decompressed)) {
        data = Buffer.from(decompressed)
      } else {
        data = decompressed
      }

      if (WebSocketUtils.encoding === 'json' && Buffer.isBuffer(data)) data = data.toString('utf8')

    }

    console.log('shard', this.id, 'message', data)

    try {
      packet = WebSocketUtils.unpack(data)

      this.onPacket(packet)
    } catch (e) {
      console.error('shard', this.id, 'error', e)
    }

  }

  private onPacket(packet?: Record<any, any>) {
    if (!packet) return
    console.log('shard', this.id, 'packet', packet)
    if (WebSocketUtils.exists(packet.s) && packet.s > this.sequence) this.sequence = packet.s

    switch (packet.t) {
      case WebSocketEvents.READY:
        this.sessionID = packet.d.session_id
        this.expectedGuilds = packet.d.guilds.map(g => g.id)
        this.heartbeat()
        this.status = WebSocketShardStatus.WAITING_FOR_GUILDS
        break
      case WebSocketEvents.RESUMED:
        this.status = WebSocketShardStatus.READY
        break
    }

    switch (packet.op) {
      case OPCodes.HELLO:
        console.log('HELLO')
        this.status = WebSocketShardStatus.IDENTIFYING
        this.identify()
        this.setupHeartbeatInterval(packet.d.heartbeat_interval)
        break

      case OPCodes.INVALID_SESSION:
        if (WebSocketUtils.exists(packet.d) && !this.manager.options.useReconnectOnly) {
          this.destroy({ reconnect: true, code: 4900 })
        } else {
          this.destroy({ reset: true, reconnect: true })
        }
        break

      case OPCodes.HEARTBEAT:
        console.log('HEARTBEAT')
        this.heartbeat()
        break

      case OPCodes.HEARTBEAT_ACK:
        console.log('HEARTBEAT_ACK')
        this.missedHeartbeats = 0
        this.ping = Date.now() - this.lastPingTimestamp
        break

      case OPCodes.RECONNECT:
        this.destroy({ reconnect: true, reset: true, code: 4000 })
        break

      case OPCodes.DISPATCH:
        // call websocket manager ws events handler
        break

      default:
        console.log('shard', this.id, 'packet with unknown opcode:', packet)
        break
    }
  }

  public send(data: any, important = false) {
    if (!this.connection || this.connection.readyState !== WebSocketStates.OPEN) return

    if (this.limits.requests.resetTime <= Date.now()) {
      this.limits.requests.resetTime = Date.now() + 60000 // 1s
      this.limits.requests.sent = 0
    }

    if (this.limits.requests.sent >= 115) { // TODO: rate limit queue processing
      if (important) this.limits.requests.queue.unshift(data)
      else this.limits.requests.queue.push(data)
    } else {
      this.connection.send(WebSocketUtils.pack(data), err => {
        if (err) console.error(err)
      })
    }
  }

  private heartbeat() {
    if (this.status === WebSocketShardStatus.RESUMING) return
    console.log('shard', this.id, 'heartbeat', this.sequence)

    if (this.missedHeartbeats > 2) {
      console.log('shard', this.id, 'missed 3 heartbeats, reconnecting')

      const reset = !!(this.sessionID && !this.manager.options.useReconnectOnly)
      return this.destroy({ reset, reconnect: true, code: reset ? 1000 : 1001 })
    }

    this.missedHeartbeats += 1
    this.lastPingTimestamp = Date.now()
    this.send({ op: OPCodes.HEARTBEAT, d: this.sequence })
  }

  private setupHeartbeatInterval(interval: number) {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (interval !== -1) this.heartbeatInterval = setInterval(this.heartbeat.bind(this), interval)
  }

  public destroy(options: WebSocketShardDestroyOptions = { code: 1000, reset: false, reconnect: false }) {

    // eslint-disable-next-line prefer-const
    let { code, reset, reconnect } = options

    if (reconnect) {
      this.status = WebSocketShardStatus.RECONNECTING
    } else {
      this.status = WebSocketShardStatus.DISCONNECTED
    }

    this.setupHeartbeatInterval(-1)

    if (this.connection?.readyState === WebSocketStates.OPEN) {
      if (!code) code = 1000
      this.connection.close(code)
    } else {
      this.removeListeners()
    }

    this.connection = undefined

    if (reset) {
      this.sequence = -1
      this.sessionID = undefined
    }

    this.missedHeartbeats = 0

    if (reconnect) {
      this.connect()
    }

  }

  public get ready() {
    return this.status === WebSocketShardStatus.READY
  }

  private removeListeners() {
    if (!this.connection) return

    // eslint-disable-next-line
    this.connection.onmessage = this.connection.onclose = this.connection.onerror = this.connection.onopen = () => {}

    // this.inflate = undefined
  }

}
