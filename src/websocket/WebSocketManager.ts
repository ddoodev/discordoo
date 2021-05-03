import { TypedEmitter } from 'tiny-typed-emitter'
import WebSocketManagerEvents from '@src/websocket/WebSocketManagerEvents'
import GatewayOptions from '@src/websocket/GatewayOptions'
import os from 'os'
import WebSocket from 'ws'
import { GatewayIdentifyData, RESTGetAPIGatewayBotResult } from 'discord-api-types'
import getGateway from '@src/util/getGateway'
import range from '../util/range'
import zlib from 'zlib'
import websocket from 'websocket'

// a few notes:
// * this.options cannot be sent to the gateway, it shall be sieved
// * WebSocketManager spawns shards and collects events from them. It doesn't
// spawn new threads or stuff like that
// * this.gateway is the result of getGateway() util
//
// Have fun!
export default class WebSocketManager extends TypedEmitter<WebSocketManagerEvents> {
  private readonly options: GatewayOptions
  private gateway?: RESTGetAPIGatewayBotResult

  private totalShards = 1

  constructor(token: string, options: Omit<GatewayOptions, 'token'>) {
    super()

    this.options = Object.assign({
      token,
      properties: {
        $browser: 'Discordoo',
        $device: 'Discordoo',
        $os: process.platform
      },
      version: 9,
      url: 'wss://gateway.discord.gg',
      compress: true,
      encoding: 'json',
      shards: 'auto',
      intents: 32509 // use all intents except privileged
    }, options)
  }

  public async connect() {
    this.gateway = await getGateway(this.options.token).catch(e => {
      throw e.statusCode === 401 ? new Error('Discordoo: invalid token provided') : e
    })

    const { shards: recommendedShards, url: gatewayUrl, session_start_limit: sessionStartLimit } = this.gateway

    const { shards } = this.options

    switch (typeof shards) {
      case 'number': {
        const totalShards = []

        this.totalShards = shards
      } break

      case 'object':
        if (!Array.isArray(shards)) throw new Error('Discordoo: WebSocketManager: type of "shards" cannot be object')
        else this.totalShards = shards.length
        break

      case 'string':
        if (shards === 'auto') this.totalShards = recommendedShards
        else if (!isNaN(parseInt(shards))) this.totalShards = parseInt(shards)
        else throw new Error('Discordoo: WebSocketManager: invalid "shards" option: ' +
          'if type of "shards" is string, it cannot be anything other than "auto"')
        break

      default:

        break
    }
  }
}
