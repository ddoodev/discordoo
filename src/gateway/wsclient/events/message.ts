// @ts-ignore
import PakoTypes from '@types/pako'
import WebSocketClient from '@src/gateway/WebSocketClient'
import WebSocket from 'ws'
import WebSocketUtils from '@src/util/WebSocketUtils'
import { GatewayOptions } from '@src/gateway'
import WebSocketPacket from '@src/gateway/interfaces/WebSocketPacket'

// handles websocket raw messages, decompressing/decoding it to normal javascript objects
export default function message(
  client: WebSocketClient,
  event: WebSocket.MessageEvent,
  options: GatewayOptions,
  inflate?: PakoTypes.Inflate
): WebSocketPacket | undefined {

  let { data } = event, packet: Record<any, any> | undefined

  if (data instanceof ArrayBuffer) data = new Uint8Array(data)

  // Buffer.concat is slow, but no alternative
  if (Array.isArray(data)) data = Buffer.concat(data)

  // data decompressing
  if (options.compress && data instanceof Uint8Array && inflate) {

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
    const decompressed = inflate.result

    // in case if packet is broken
    if (!decompressed) return

    // preparing data for subsequent processing
    if (decompressed instanceof Uint8Array || Array.isArray(decompressed)) {
      data = Buffer.from(decompressed)
    } else {
      data = decompressed
    }

    // if we use erlpack data will be buffer, so else we unpack it to string
    if (WebSocketUtils.encoding === 'json' && Buffer.isBuffer(data)) data = data.toString('utf8')
  }

  console.log('shard', client.id, 'message', data)

  try {
    // data unpacking from string/utf to json
    packet = WebSocketUtils.unpack(data)
  } catch (e) {
    // packet is broken (invalid json, for example)
    console.error('shard', client.id, 'error', e)
  }

  // data is fully ready, return it (or return nothing in error case)
  return packet as WebSocketPacket | undefined

}
