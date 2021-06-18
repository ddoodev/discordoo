// @ts-ignore
import PakoTypes from '@types/pako'
import WebSocket from 'ws'
import { TypedEmitter } from 'tiny-typed-emitter'

import WebSocketClientEventsI from '@src/gateway/interfaces/WebSocketClientEventsI'
import WebSocketSendPayload from '@src/gateway/interfaces/WebSocketSendPayload'
import GatewayOptions from '@src/gateway/interfaces/GatewayOptions'
import WebSocketPacket from '@src/gateway/interfaces/WebSocketPacket'
import WebSocketClientDestroyOptions from '@src/gateway/interfaces/WebSocketClientDestroyOptions'
import {
  WebSocketOPCodes,
  WebSocketClientEvents,
  WebSocketClientStates,
  WebSocketStates,
  WS_HANDSHAKE_TIMEOUT
} from '@src/core/Constants'

import WebSocketManager from '@src/gateway/WebSocketManager'
import WebSocketUtils from '@src/utils/WebSocketUtils'
import DiscordooError from '@src/utils/DiscordooError'

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
  private _heartbeatInterval?: NodeJS.Timeout
  private _handshakeTimeout?: NodeJS.Timeout

  public manager: WebSocketManager
  public status: WebSocketClientStates
  public id: number

  public sessionID?: string
  public sequence = -1
  public closeSequence = -1
  public expectedGuilds: Set<any> = new Set()
  public missedHeartbeats = 0
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

      // cannot connect without websocket url
      if (!this.options.url) return reject()

      // WebSocketClient already connected and working
      if (this.socket?.readyState === WebSocketStates.OPEN && this.status === WebSocketClientStates.READY) {
        resolve()
      }

      // create decompressing context if developer wants use compression between us and discord
      if (this.manager.options.compress) {
        if (!WebSocketUtils.pako) {
          reject(new DiscordooError(
            'WebSocketShard ' + this.id,
            'gateway compression requires pako module installed. npm i pako@1.0.11'
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

      /**
       * when we call WebSocketClient#connect, it returns a promise.
       * this function resolves promise when shard successfully connected,
       * and rejects promise when shard failed to connect for some reason.
       * when promise resolved/rejected, it removes the used before listeners.
       * */
      function cleanupOrListen(client: WebSocketClient, listen = false) {
        const direction = listen ? client.once : client.removeListener

        direction.call(client, WebSocketClientEvents.WS_CLOSED, closed)
        direction.call(client, WebSocketClientEvents.READY, ready)
        direction.call(client, WebSocketClientEvents.RESUMED, resumed)
        direction.call(client, WebSocketClientEvents.INVALID_SESSION, invalid)
        direction.call(client, WebSocketClientEvents.DESTROYED, invalid)
      }

      cleanupOrListen(this, true)

      // in case if websocket already running
      if (this.socket?.readyState === WebSocketStates.OPEN) {
        console.log('shard', this.id, 'identify open websocket')
        return this.identify()
      } else if (this.socket) { // remove websocket object because it is no longer needed
        this.socket = undefined
      }

      this.status =
        this.status === WebSocketClientStates.DISCONNECTED
        ? WebSocketClientStates.RECONNECTING
        : WebSocketClientStates.CONNECTING

      try {
        console.log('shard', this.id, 'creating websocket')
        this.socket = new WebSocket(this.options.url)

        this.handshakeTimeout()
        console.log('shard', this.id, 'subscribe')
        this.socket.onopen = this.onOpen.bind(this)
        this.socket.onclose = this.onClose.bind(this)
        this.socket.onerror = this.onError.bind(this)
        this.socket.onmessage = this.onMessage.bind(this)
      } catch (e) {
        console.error('shard', this.id, 'error', e)
        this.status = WebSocketClientStates.DISCONNECTED
        reject()
      }
    })
  }

  identify() {
    const data = identify(this, this.options)

    this.socketSend(data)
  }

  /**
   * this method operates with handshake timeout:
   * when handshake did not occur at the specified time,
   * reconnects client
   * */
  public handshakeTimeout(create = true) {
    if (this._handshakeTimeout) {
      clearTimeout(this._handshakeTimeout)
    } else if (create) {
      this._handshakeTimeout = setTimeout(() => {
        this.destroy({ reconnect: true })
      }, WS_HANDSHAKE_TIMEOUT)
    }
  }

  /** this method operates with heartbeat interval: it can delete interval, or create new one */
  public heartbeatInterval(ms: number) {
    if (ms < 0) {
      if (this._heartbeatInterval) clearInterval(this._heartbeatInterval)
      this._heartbeatInterval = undefined
    } else {
      this._heartbeatInterval = setInterval(() => {
        this.heartbeat()
      }, ms)
    }
  }

  public heartbeat(
    shouldIgnoreAck = [
      WebSocketClientStates.RESUMING,
      WebSocketClientStates.IDENTIFYING,
      WebSocketClientStates.WAITING_FOR_GUILDS
    ].includes(this.status)
  ) {

    // handle zombie connections
    if (this.missedHeartbeats > 1) {
      console.log('shard', this.id, 'is a zombie connection! arrr!')
      this.destroy({ reconnect: true })
    }

    // cannot heartbeat when resuming
    if (this.status === WebSocketClientStates.RESUMING) return

    // increase missed heartbeats count to detect zombie connections
    if (!shouldIgnoreAck) this.missedHeartbeats += 1

    this.lastPingTimestamp = Date.now()
    this.socketSend({ op: WebSocketOPCodes.HEARTBEAT, d: this.sequence })
  }

  public socketSend(data: WebSocketSendPayload) {
    if (!this.socket) return

    console.log('shard', this.id, 'send:', data)

    this.socket.send(WebSocketUtils.pack(data), err => {
      if (err) this.emit(WebSocketClientEvents.WS_SEND_ERROR, err, data)
    })
  }

  private onMessage(event: WebSocket.MessageEvent) {
    const data: WebSocketPacket | undefined = message(this, event, this.options, this.inflate)

    if (data) this.onPacket(data)
  }

  private onPacket(payload: WebSocketPacket) {
    packet(this, payload)
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

    console.log('shard', this.id, 'destroying, options', options)
    if (
      this.socket
      && this.socket.readyState !== WebSocketStates.CLOSED
      && this.socket.readyState !== WebSocketStates.CLOSING
    ) {
      console.log('shard', this.id, 'if this socket and dont ready')
      try {
        if (options.reconnect && this.sessionID) {
          console.log('shard', this.id, 'if options reconnect and sessionid')
          if (this.options.useReconnectOnly) {
            console.log('shard', this.id, 'if useReconnectOnly')
            this.sessionID = undefined
            this.sequence = -1
            this.socket.close(1000, 'ddoo: reconnect without resume')
          } else {
            console.log('shard', this.id, '!useReconnectOnly')
            this.closeSequence = this.sequence
            this.sequence = -1
            this.socket.close(4901, 'ddoo: reconnect with resume')
          }
        }
      } catch (e) {
        console.log('shard', this.id, 'ws close error:', e)
        this.emit(WebSocketClientEvents.WS_CLOSE_ERROR, e)
      }
    } else {
      console.log('shard', this.id, 'socket terminate')
      if (options.code !== 1000 && this.sequence > 0) {
        this.closeSequence = this.sequence
        this.sequence = -1
      }
      this.socket?.terminate()
    }

    console.log('shard', this.id, 'socket cleanup')
    this.cleanup()

    console.log('shard', this.id, 'emitting reconnect')
    if (options.reconnect) this.emit(WebSocketClientEvents.RECONNECT_ME, true)
  }

  public get ready() {
    return this.status === WebSocketClientStates.READY
  }

  private cleanup() {

    this.heartbeatInterval(-1) // remove heartbeat interval
    this.handshakeTimeout(false) // remove handshake timeout
    this.inflate = undefined // clean decompression context
    this.missedHeartbeats = 0

    if (!this.socket) return

    // clean listeners
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.socket.onmessage = this.socket.onclose = this.socket.onopen = this.socket.onerror = () => {}
  }

}
