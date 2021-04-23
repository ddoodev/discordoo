import WebSocket from 'ws'
import { GatewayHello, GatewayIdentifyData, GatewayReceivePayload, GatewaySendPayload } from 'discord-api-types'
import { TypedEmitter } from 'tiny-typed-emitter'
import WSShardEvents from '@src/ws/WSShardEvents'
// eslint-disable-next-line
// @ts-ignore
import PakoTypes from '@types/pako'

let Erlpack
try {
  Erlpack = require('erlpack')
// eslint-disable-next-line
} catch {}

let Pako
try {
  Pako = require('pako')
// eslint-disable-next-line
} catch {}

export default class WSShard extends TypedEmitter<WSShardEvents> {
  connection: WebSocket
  identify: GatewayIdentifyData
  boundEvents = false
  heartbeat = 0
  private heartbeatInterval: ReturnType<typeof setInterval> | undefined
  useErlpack = false
  usePako = false
  pako: PakoTypes.Inflate

  constructor(options: { identify: GatewayIdentifyData, url: string, useErlpack: boolean, usePako: boolean }) {
    super()
    this.connection = new WebSocket(options.url)
    this.identify = options.identify

    this.useErlpack = options.useErlpack
    this.usePako = options.usePako

    if (this.usePako && Pako) {
      this.pako = new Pako.Inflate()
    }

    this.connection.on('message', this.handleMessage)
    this.connection.on('open', this.handleOpen)
  }

  private handleOpen() {
    this.emit('connect')

  }

  private async handleMessage(msg: string | Buffer | ArrayBuffer | Buffer[]) {
    const data = await this.decodeMessage(msg)
    if (data.op === 10) {
      this.heartbeat = (data as GatewayHello).d.heartbeat_interval
    }
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)
    this.heartbeatInterval = setInterval(() => {

    }, this.heartbeat)
  }

  async send(op: 1 | 2 | 3 | 4 | 5 | 6 | 8, data: GatewaySendPayload['d']) {
    this.connection.send({
      op,
    })
  }

  private async decodeMessage(msg: string | Buffer | ArrayBuffer | Buffer[]): Promise<GatewayReceivePayload> {
    if (typeof msg === 'string') return JSON.parse(msg) as GatewayReceivePayload

    let output = msg
    if (msg instanceof ArrayBuffer) {
      output = Buffer.from(msg)
    } else if (Array.isArray(msg)) {
      output = Buffer.concat(msg)
    }

    const auf = output as Buffer // i hate typescript

    if (this.usePako && Pako) {
      if (auf.length >= 4 && auf.readUInt32BE(auf.length - 4) === 0xFFFF) { // ancient magic taken from Eris

      }
    }
  }
}
