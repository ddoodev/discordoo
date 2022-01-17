let pack, unpack, encoding: 'json' | 'etf' = 'json', pako

try {
  const erlpack = require('erlpack')

  if (erlpack?.pack && erlpack?.unpack) {
    pack = erlpack.pack
    unpack = erlpack.unpack
    encoding = 'etf'
  } else {
    pack = JSON.stringify
    unpack = JSON.parse
  }
} catch (e) {
  pack = JSON.stringify
  unpack = JSON.parse
}

try {
  pako = require('zlib-sync')
} catch (e) {} // eslint-disable-line no-empty

try {
  if (!pako) pako = require('pako')
} catch (e) {} // eslint-disable-line no-empty

const decoder = new TextDecoder()

export class WebSocketUtils {
  static pack = pack

  static encoding = encoding

  static pako = pako

  static unpack(data: any, type: 'json' | 'etf' = encoding): Record<any, any> {
    if (typeof data === 'string' || type === 'json') {
      if (typeof data !== 'string') {
        data = decoder.decode(data)
      }

      return JSON.parse(data)
    }

    return unpack(data)
  }

  static exists<T>(packet: any): packet is T {
    return packet !== undefined && packet !== null
  }
}
