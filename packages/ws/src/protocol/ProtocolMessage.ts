import ProtocolEvents from './ProtocolEvents'

export default interface ProtocolMessage<K extends keyof ProtocolEvents = keyof ProtocolEvents> {
  event: K,
  payload: ProtocolEvents[K]
}
