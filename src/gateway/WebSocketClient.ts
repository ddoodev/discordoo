// @ts-ignore
import PakoTypes from '@types/pako'
import WebSocket from 'ws'
import { TypedEmitter } from 'tiny-typed-emitter'

import { WebSocketClientDestroyOptions } from '@src/gateway/interfaces/WebSocketClientDestroyOptions'
import { WebSocketClientEventsHandlers } from '@src/gateway/interfaces/WebSocketClientEventsHandlers'
import { CompletedGatewayOptions } from '@src/gateway/interfaces/GatewayOptions'
import { GatewayOpCodes, GatewaySendPayloadLike } from '@discordoo/providers'
import { WebSocketPacket } from '@src/gateway/interfaces/WebSocketPacket'
import {
  WebSocketClientEvents,
  WebSocketClientStates,
  WebSocketStates
} from '@src/constants'

import { WebSocketManager } from '@src/gateway/WebSocketManager'
import { WebSocketUtils } from '@src/utils/WebSocketUtils'
import { DiscordooError } from '@src/utils/DiscordooError'

import { identify } from '@src/gateway/client/identify'
import { message } from '@src/gateway/client/message'
import { packet } from '@src/gateway/client/packet'
import { error } from '@src/gateway/client/error'
import { close } from '@src/gateway/client/close'
import { open } from '@src/gateway/client/open'

export class WebSocketClient extends TypedEmitter<WebSocketClientEventsHandlers> {
  private socket?: WebSocket
  private readonly options: CompletedGatewayOptions
  private inflate?: PakoTypes.Inflate
  private _heartbeatInterval?: ReturnType<typeof setInterval>
  private _handshakeTimeout?: ReturnType<typeof setTimeout>

  public manager: WebSocketManager
  public status: WebSocketClientStates
  public id: number

  public sessionId?: string
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
    // console.log('SHARD', this.id, 'CONNECTING with intents', this.options.intents)
    return new Promise<void>((resolve, reject) => {

      // cannot connect without websocket url
      if (!this.options.connection.url) return reject()

      // WebSocketClient already connected and working
      if (this.socket?.readyState === WebSocketStates.OPEN && this.status === WebSocketClientStates.READY) {
        resolve()
      }

      // create decompressing context if developer wants use compression between us and discord
      if (this.options.connection.compress) {
        if (!WebSocketUtils.pako) {
          throw new DiscordooError(
            'WebSocketShard ' + this.id,
            'gateway compression requires pako/zlib-sync module installed. npm i pako@1.0.11 / npm i zlib-sync'
          )
        } else {
          this.inflate = new WebSocketUtils.pako.Inflate({
            chunkSize: 128 * 1024
          })
        }
      }

      // console.log('SHARD', this.id, 'ENCODING', this.options.encoding, 'REAL ENCODING', WebSocketUtils.encoding)

      // cannot use etf encoding without erlpack
      if (this.options.connection.encoding === 'etf' && WebSocketUtils.encoding !== 'etf') {
        throw new DiscordooError(
          'WebSocketShard ' + this.id,
          'cannot use etf encoding without erlpack installed.'
        )
      }

      const cleanup = () => {
        cleanupOrListen(this)
      }

      const ready   = () => { cleanup(); resolve() },
            resumed = () => { cleanup(); resolve() },
            invalid = (e: WebSocket.CloseEvent) => { cleanup(); reject({ code: e.code, reason: 'Invalid session' }) },
            closed  = (e: WebSocket.CloseEvent) => { cleanup(); reject({ code: e.code, reason: e.reason }) }

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
      }

      cleanupOrListen(this, true)

      // in case if websocket already running
      if (this.socket?.readyState === WebSocketStates.OPEN) {
        // console.log('shard', this.id, 'identify open websocket')
        return this.identify()
      } else if (this.socket) { // remove websocket object because it is no longer needed
        this.socket = undefined
      }

      this.status =
        this.status === WebSocketClientStates.DISCONNECTED
        ? WebSocketClientStates.RECONNECTING
        : WebSocketClientStates.CONNECTING

      try {
        // console.log('shard', this.id, 'creating websocket', this.options.url)
        this.socket = new WebSocket(this.options.connection.url)

        this.handshakeTimeout()
        // console.log('shard', this.id, 'subscribe')
        this.socket.onopen = this.onOpen.bind(this)
        this.socket.onclose = this.onClose.bind(this)
        this.socket.onerror = this.onError.bind(this)
        this.socket.onmessage = this.onMessage.bind(this)
      } catch (e) {
        // console.error('shard', this.id, 'error', e)
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
   * it reconnects the client
   * */
  public handshakeTimeout(create = true) {
    if (this._handshakeTimeout) {
      clearTimeout(this._handshakeTimeout)
    } else if (create) {
      this._handshakeTimeout = setTimeout(() => {
        this.destroy({ reconnect: true })
      }, 15000 /* TODO: this.options.handshakeTimeout */)
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
      // console.log('shard', this.id, 'is a zombie connection! arrr!')
      this.destroy({ reconnect: true })
    }

    // cannot heartbeat when resuming
    if (this.status === WebSocketClientStates.RESUMING) return

    // increase missed heartbeats count to detect zombie connections
    if (!shouldIgnoreAck) this.missedHeartbeats += 1

    this.lastPingTimestamp = Date.now()
    this.socketSend({ op: GatewayOpCodes.HEARTBEAT, d: this.sequence })
  }

  public socketSend(data: GatewaySendPayloadLike) {
    if (!this.socket) {
      this.emit(WebSocketClientEvents.WS_SEND_ERROR, new Error('Tried to send packet, but no WebSocket was found'), data)
      return
    }

    // console.log('shard', this.id, 'send:', data)

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
    // console.log('shard', this.id, 'closed', event)
    close(this, event)
  }

  private onOpen(event: WebSocket.OpenEvent) {
    // console.log('shard', this.id, 'open', event)
    open(this, event)
  }

  private onError(event: WebSocket.ErrorEvent) {
    // console.log('shard', this.id, 'error', event)
    error(this, event)
  }

  public destroy(options: WebSocketClientDestroyOptions = {}) {

    // console.log('shard', this.id, 'destroying, options', options)
    if (
      this.socket
      && this.socket.readyState !== WebSocketStates.CLOSED
      && this.socket.readyState !== WebSocketStates.CLOSING
    ) {
      // console.log('shard', this.id, 'if this socket and dont ready')
      try {
        if (options.reconnect && this.sessionId) {
          this.closeSequence = this.sequence
          this.sequence = -1
          this.socket.close(4901, 'ddoo: reconnect with resume')
        }
      } catch (e: any) {
        // console.log('shard', this.id, 'ws close error:', e)
        this.emit(WebSocketClientEvents.WS_CLOSE_ERROR, e)
      }
    } else {
      // console.log('shard', this.id, 'socket terminate')
      if (options.code !== 1000 && this.sequence > 0) {
        this.closeSequence = this.sequence
        this.sequence = -1
      }
      this.socket?.terminate()
    }

    // console.log('shard', this.id, 'socket cleanup')
    this.cleanup()

    // console.log('shard', this.id, 'emitting reconnect')
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

    this.socket.terminate()
  }

}
