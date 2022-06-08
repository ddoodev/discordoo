// @ts-ignore
import PakoTypes from '@types/pako'
import { WebSocketClient } from '@src/gateway/WebSocketClient'
import WebSocket from 'ws'
import { WebSocketUtils } from '@src/utils/WebSocketUtils'
import { WebSocketPacket } from '@src/gateway/interfaces/WebSocketPacket'
import { CompletedGatewayOptions } from '@src/gateway/interfaces/GatewayOptions'

// handles websocket raw messages, decompressing/decoding it to normal javascript objects
export function message(
  client: WebSocketClient,
  event: WebSocket.MessageEvent,
  options: CompletedGatewayOptions,
  inflate?: PakoTypes.Inflate
): WebSocketPacket | undefined {

  let { data } = event, packet: Record<any, any> | undefined

  // console.log('shard', client.id, 'message', data)

  if (data instanceof ArrayBuffer) data = new Uint8Array(data)

  // Buffer.concat is slow, but no alternative
  if (Array.isArray(data)) data = Buffer.concat(data)

  // data decompressing
  if (options.connection.compress && data instanceof Uint8Array && inflate) {

    const l = data.length
    const flush = l >= 4 // flush means that this chunk is last
      && data[l - 4] === 0x00
      && data[l - 3] === 0x00
      && data[l - 2] === 0xff
      && data[l - 1] === 0xff

    // discord says: "always push the message data to your cache". so do it
    // if this is last chunk, we say that to pako using Z_SYNC_FLUSH.
    // then pako will decompress all received chunks
    inflate.push(data, flush ? WebSocketUtils.pako.Z_SYNC_FLUSH : false)
    if (!flush) return // we can't process if this is not the last chunk
    const decompressed: any = inflate.result

    // in case if packet is broken
    if (!decompressed) return

    // preparing data for subsequent processing
    data = Buffer.from(decompressed)

    // if we use erlpack data will be buffer, so else we unpack it to string
    if (WebSocketUtils.encoding === 'json') data = data.toString('utf8')
  }

  try {
    // data unpacking from string/utf to json
    packet = WebSocketUtils.unpack(data)
  } catch (e) {
    // packet is broken (invalid json, for example)
    // console.error('shard', client.id, 'error', e)
  }

  // data is fully ready, return it (or return nothing in error case)
  return packet as WebSocketPacket | undefined

}
