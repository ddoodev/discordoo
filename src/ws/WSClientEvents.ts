import { GatewayReceivePayload } from 'discord-api-types'

export default interface WSClientEvents {
  message: (msg: GatewayReceivePayload, id: number) => void
  connected: (id: number) => void
  disconnected: (id: number) => void,
  shardSpawn: (id: number) => void
}