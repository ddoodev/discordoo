import {GatewayReceivePayload} from 'discord-api-types'

export default interface WSClientEvents {
  message: (msg: GatewayReceivePayload) => void
  connected: () => void
  disconnected: () => void
}