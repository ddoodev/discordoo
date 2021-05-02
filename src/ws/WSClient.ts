import { TypedEmitter } from 'tiny-typed-emitter'
import WSClientEvents from '@src/ws/WSClientEvents'
import GatewayOptions from '@src/ws/GatewayOptions'
import os from 'os'
import WebSocket from 'ws'
import { GatewayIdentifyData, RESTGetAPIGatewayBotResult } from 'discord-api-types'
import getGateway from '@src/util/getGateway'
import range from '../util/range'
// import WSShard from './WSShard'
import zlib from 'zlib'
import websocket from 'websocket'

// a few notes:
// * this.options cannot be sent to the gateway, it shall be sieved
// * WSClient spawns shards and collects events from them. It doesn't
// spawn new threads or stuff like that
// * this.gateway is the result of getGateway() util
//
// Have fun!
export default class WSClient extends TypedEmitter<WSClientEvents> {
  private options: GatewayOptions
  private gateway?: RESTGetAPIGatewayBotResult

  constructor(token: string, options: Omit<GatewayOptions, 'token'>) {
    super()
    this.options = Object.assign({
      token,
      properties: {
        $browser: 'Discordoo',
        $device: 'Discordoo',
        $os: process.platform
      },
      version: 8,
      url: 'wss://gateway.discord.gg',
      compress: true,
      encoding: 'json',
      shards: 'auto',
      intents: 32509 // use all intents except privileged
    } as GatewayOptions, options)
  }
}
