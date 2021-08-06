/*
The MIT License (MIT)

Copyright (c) 2016-2021 abalabahaha

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

--
http://github.com/abalabahaha/eris
*/

import { WebSocketUtils } from '@src/utils'

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
