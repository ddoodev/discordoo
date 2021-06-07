// @ts-ignore
import PakoTypes from '@types/pako'
import WebSocket from 'ws'
import { TypedEmitter } from 'tiny-typed-emitter'

import WebSocketClientEventsI from '@src/gateway/interfaces/WebSocketClientEventsI'
import WebSocketSendPayload from '@src/gateway/interfaces/WebSocketSendPayload'
import GatewayOptions from '@src/gateway/interfaces/GatewayOptions'
import WebSocketPacket from '@src/gateway/interfaces/WebSocketPacket'
import WebSocketClientDestroyOptions from '@src/gateway/interfaces/WebSocketClientDestroyOptions'
import { OPCodes, WebSocketClientEvents, WebSocketClientStates, WebSocketStates } from '@src/core/Constants'

import WebSocketManager from '@src/gateway/WebSocketManager'
import WebSocketUtils from '@src/util/WebSocketUtils'
import DiscordooError from '@src/util/DiscordooError'

import identify from '@src/gateway/wsclient/identify'
import open from '@src/gateway/wsclient/events/open'
import error from '@src/gateway/wsclient/events/error'
import close from '@src/gateway/wsclient/events/close'
import message from '@src/gateway/wsclient/events/message'
import packet from '@src/gateway/wsclient/events/packet'

export default class WebSocketClient extends TypedEmitter<WebSocketClientEventsI> {
  private socket?: WebSocket
  private readonly options: GatewayOptions
  private inflate?: PakoTypes.Inflate

  public manager: WebSocketManager
  public status: WebSocketClientStates
  public id: number

  public sessionID?: string
  public sequence = -1
  public closeSequence = -1
  public expectedGuilds: Set<any> = new Set()
  public missedHeartbeats = 0
  public heartbeatInterval?: NodeJS.Timeout
  public ping = -1
  public lastPingTimestamp = Date.now()

  constructor(manager: WebSocketManager, id: number) {
    super()

    this.options = manager.options

    this.manager = manager
    this.status = WebSocketClientStates.CREATED
    this.id = id
  }

  public connect() {
    return new Promise<void>((resolve, reject) => {

      if (!this.options.url) return reject()

      if (this.socket?.readyState === WebSocketStates.OPEN && this.status === WebSocketClientStates.READY) {
        resolve()
      }

      if (this.manager.options.compress && !this.sessionID) {
        if (!WebSocketUtils.pako) {
          reject(new DiscordooError(
            'WebSocketShard ' + this.id,
            'gateway compression requires pako@1.0.11 module installed'
          ))
        } else {
          this.inflate = new WebSocketUtils.pako.Inflate({
            chunkSize: 128 * 1024
          })
        }
      }

      const cleanup = () => {
        cleanupOrListen(this)
      }

      const ready   = () => { cleanup(); resolve() },
            resumed = () => { cleanup(); resolve() },
            invalid = () => { cleanup(); reject() },
            closed  = () => { cleanup(); reject() }

      function cleanupOrListen(client: WebSocketClient, listen = false) {
        console.log('client', client)
        const direction = listen ? client.once : client.removeListener

        direction.call(client, WebSocketClientEvents.WS_CLOSED, closed)
        direction.call(client, WebSocketClientEvents.READY, ready)
        direction.call(client, WebSocketClientEvents.RESUMED, resumed)
        direction.call(client, WebSocketClientEvents.INVALID_SESSION, invalid)
        direction.call(client, WebSocketClientEvents.DESTROYED, invalid)
      }

      cleanupOrListen(this, true)

      if (this.socket?.readyState === WebSocketStates.OPEN) {
        console.log('shard', this.id, 'identify open websocket')
        return this.identify()
      } else if (this.socket) {
        this.socket = undefined
      }

      this.status =
        this.status === WebSocketClientStates.DISCONNECTED
        ? WebSocketClientStates.RECONNECTING
        : WebSocketClientStates.CONNECTING

      try {
        console.log('shard', this.id, 'creating websocket')
        this.socket = new WebSocket(this.options.url)

        console.log('shard', this.id, 'subscribe')
        this.socket.onopen = this.onOpen.bind(this)
        this.socket.onclose = this.onClose.bind(this)
        this.socket.onerror = this.onError.bind(this)
        this.socket.onmessage = this.onMessage.bind(this)
      } catch (e) {
        this.status = WebSocketClientStates.DISCONNECTED
        reject()
      }
    })
  }

  private identify() {
    const data = identify(this, this.options)

    this.socketSend(data)
  }

  private setHeartbeatInterval(ms: number) {
    if (ms < 0) {
      if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = undefined
    } else {
      this.heartbeatInterval = setInterval(() => {
        this.heartbeat()
      }, ms)
    }
  }

  private heartbeat(
    shouldIgnoreAck = [
      WebSocketClientStates.RESUMING,
      WebSocketClientStates.IDENTIFYING,
      WebSocketClientStates.WAITING_FOR_GUILDS
    ].includes(this.status)
  ) {

    // handle zombie connection
    if (this.missedHeartbeats > 1) {
      console.log('zombie connection! arrr!')
    }

    if (!shouldIgnoreAck) this.missedHeartbeats += 1
    this.lastPingTimestamp = Date.now()
    this.socketSend({ op: OPCodes.HEARTBEAT, d: this.sequence })
  }

  public socketSend(data: WebSocketSendPayload) {
    if (!this.socket) return

    this.socket.send(WebSocketUtils.pack(data), err => {
      if (err) this.emit('WS_SEND_ERROR', err, data)
    })
  }

  private onMessage(event: WebSocket.MessageEvent) {
    const data: WebSocketPacket | undefined = message(this, event, this.options, this.inflate)

    if (data) this.onPacket(data)
  }

  private onPacket(payload: WebSocketPacket) {
    packet(this, payload, {
      identify: this.identify,
      heartbeat: this.heartbeat,
      destroy: this.destroy,
      setHeartbeatInterval: this.setHeartbeatInterval
    })
  }

  private onClose(event: WebSocket.CloseEvent) {
    console.log('shard', this.id, 'closed', event)
    close(this, event)
  }

  private onOpen(event: WebSocket.OpenEvent) {
    console.log('shard', this.id, 'open', event)
    open(this, event)
  }

  private onError(event: WebSocket.ErrorEvent) {
    console.log('shard', this.id, 'error', event)
    error(this, event)
  }

  public destroy(options: WebSocketClientDestroyOptions = {}) {
    return 1
  }

  public get ready() {
    return this.status === WebSocketClientStates.READY
  }

  private cleanup() {
    if (!this.socket) return

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.socket.onmessage = this.socket.onclose = this.socket.onopen = this.socket.onerror = () => {}

    this.inflate = undefined
  }

}
