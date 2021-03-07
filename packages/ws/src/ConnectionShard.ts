import WebSocket from 'ws'
import * as Util from '@discordoo/util'
import ProtocolEvents from './protocol/ProtocolEvents'
import worker_threads from 'worker_threads'
import ProtocolMessage from './protocol/ProtocolMessage'
import { GatewayDispatchPayload, GatewayHeartbeat } from 'discord-api-types'
import os from 'os'
// import ZlibSync from 'zlib-sync'

/**
 * The thing that actually connects to Discord
 */
export default class ConnectionShard {
  connection?: WebSocket
  credentials?: { id: number, token: string, total: number, intents?: number }
  // inflateContext: ZlibSync.Inflate
  private sequence: number | null =  null

  constructor() {
    // this.inflateContext = new ZlibSync.Inflate
  }

  private decodeMessage(message: WebSocket.Data): GatewayDispatchPayload {
    return JSON.parse(message.toString()) as GatewayDispatchPayload
  }

  private awaitForHeartBeat(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.connection?.on('message', message => {
        const m =
          this.decodeMessage(message as Buffer) as unknown as GatewayHeartbeat & { d: { heartbeat_interval: number } }
        if (m.op === 10) {
          resolve(m.d.heartbeat_interval)
        }
      })
    })
  }

  private awaitForHelloPayload(): Promise<ProtocolEvents['HELLO']> | undefined {
    return new Promise<ProtocolEvents['HELLO']>((resolve, reject) => {
      worker_threads.parentPort!.on('message', msg => {
        const data = JSON.parse(msg) as ProtocolMessage
        if (data.event === 'HELLO') {
          resolve(data.payload as ProtocolEvents['HELLO'])
        }
      })
    })
  }

  private buildIdentifyPayload(): any {
    return {
      op: 2,
      d: {
        token: this.credentials!.token!,
        intents: this.credentials!.intents ?? 32509,
        properties: {
          $os: os.platform(),
          $browser: 'discordoo',
          $device: 'discordoo'
        },
        shard: [ this.credentials!.id, this.credentials!.total ],
        presence: {
          status: 'dnd',
          afk: false,
          activities: [ {
            name: 'Hello from Discordoo!',
            type: 0,
            created_at: new Date()
          } ]
        }
      }
    }
  }

  async connect() {
    this.credentials = await this.awaitForHelloPayload()
    this.connection = new WebSocket(Util.Constants.GATEWAY_URL(8, 'json', false))

    this.connection.on('message', msg => {
      const message = this.decodeMessage(msg as Buffer)
      this.sequence = message.s ?? this.sequence
      console.log('msg', message)
    })

    this.connection.on('open', async () => {
      console.log('open')
      const heartbeat = await this.awaitForHeartBeat()
      this.connection!.send(JSON.stringify(this.buildIdentifyPayload()))
      setInterval(() => {
        this.connection!.send(JSON.stringify({
          op: 1,
          d: this.sequence
        }))
        console.log(this.sequence, 'sent')
      }, heartbeat)
    })

    this.connection.on('error', console.log)
  }
}