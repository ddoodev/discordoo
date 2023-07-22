import { WebSocketUtils } from '../../src/utils'

/**
 * A utility for combining multiple files and a body for sending to the Discord API
 * */
export class MultipartData {
  public readonly boundary: string
  private readonly buffs: Buffer[]

  constructor() {
    this.boundary = '----------------ddoo'
    this.buffs = []
  }

  attach(fieldName: string, data: any, fileName?: string): void {
    if (!WebSocketUtils.exists(data)) return

    let str = '\r\n--' + this.boundary + '\r\nContent-Disposition: form-data; name="' + fieldName + '"'

    if (fileName) {
      str += '; filename="' + fileName + '"'
    }

    if (ArrayBuffer.isView(data)) {
      str +='\r\nContent-Type: application/octet-stream'

      if (!(data instanceof Uint8Array)) {
        data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
      }
    } else if (typeof data === 'object') {
      str +='\r\nContent-Type: application/json'
      data = Buffer.from(JSON.stringify(data))
    } else {
      data = Buffer.from('' + data)
    }

    this.buffs.push(Buffer.from(str + '\r\n\r\n'))
    this.buffs.push(data)
  }

  finish(): Buffer {
    this.buffs.push(Buffer.from('\r\n--' + this.boundary + '--'))
    return Buffer.concat(this.buffs)
  }
}
