let pack, unpack, encoding: 'json' | 'etf' = 'json'

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

const decoder = new TextDecoder()

export default class WebSocketUtils {
  static pack = pack

  static encoding = encoding

  static unpack(data: any, type: 'json' | 'etf' = encoding): Record<any, any> {
    if (typeof data === 'string' || type === 'json') {
      if (typeof data !== 'string') {
        data = decoder.decode(data)
      }

      return JSON.parse(data)
    }

    return unpack(data)
  }

  static exists(packet: any): boolean {
    return packet !== undefined && packet !== null
  }
}
