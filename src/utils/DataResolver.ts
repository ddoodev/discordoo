import { BufferResolvable } from '@src/utils/interfaces/BufferResolvable'
import { ResolveBufferOptions } from '@src/utils/interfaces/ResolveBufferOptions'
import { request } from 'undici'
import { DiscordooError } from '@src/utils/DiscordooError'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { MessageAttachmentResolvable } from '@src/api'
import { Base64Resolvable } from '@src/utils/interfaces/Base64Resolvable'

const read = promisify(fs.readFile)

export class DataResolver {
  static async resolveBuffer(buffer: BufferResolvable, options?: ResolveBufferOptions): Promise<Buffer | ArrayBuffer> {
    if (Buffer.isBuffer(buffer) || buffer instanceof ArrayBuffer) return buffer

    if (typeof buffer === 'object' && typeof buffer.pipe === 'function') {
      return new Promise<Buffer>((resolve, reject) => {

        const _buf: any[] = []

        buffer.on('data', chunk => _buf.push(chunk))
        buffer.on('end', () => resolve(Buffer.concat(_buf)))
        buffer.on('error', err => reject(`error converting stream - ${err}`))

      })

    }

    if (typeof buffer === 'string') {
      if (options?.fetch) {
        if (buffer.startsWith('https://') || buffer.startsWith('http://')) {
          return request(buffer, options.fetchOptions).then(r => r.body.arrayBuffer())
        }
      }

      const filePath = path.resolve(buffer)
      return read(filePath)
    }

    throw new DiscordooError('DataResolver', 'do not know how to resolve buffer from:', typeof buffer)
  }

  static async resolveBase64(resolvable: Base64Resolvable): Promise<string> {
    if (!resolvable) {
      throw new DiscordooError('DataResolver', 'do not know how to resolve base64 from', resolvable)
    }

    if (typeof resolvable === 'string' && resolvable.startsWith('data:')) {
      return resolvable
    }

    const buffer = await this.resolveBuffer(resolvable)
    return `data:image/png;base64,${buffer instanceof ArrayBuffer ? this.arrayBufferToBase64(buffer) : buffer.toString('base64')}`
  }

  static arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
    // based on https://gist.github.com/jonleighton/958841 (MIT license)
    let base64 = ''
    const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    const bytes = new Uint8Array(arrayBuffer)
    const byteLength = bytes.byteLength
    const byteRemainder = byteLength % 3
    const mainLength = byteLength - byteRemainder

    let a, b, c, d
    let chunk

    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12 // 258048 = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6 // 4032 = (2^6 - 1) << 6
      d = chunk & 63 // 63 = 2^6 - 1

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength]

      a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4 // 3 = 2^2 - 1

      base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

      a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >>  4 // 1008 = (2^6 - 1) << 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2 // 15 = 2^4 - 1

      base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
  }

  static isBufferResolvable(resolvable: any): resolvable is BufferResolvable {
    if (Buffer.isBuffer(resolvable) || resolvable instanceof ArrayBuffer) return true
    if (typeof resolvable === 'object' && typeof resolvable.pipe === 'function') return true

    return typeof resolvable === 'string' && (resolvable.startsWith('https://') || resolvable.startsWith('http://'))
  }

  static isMessageAttachmentResolvable(resolvable: any): resolvable is MessageAttachmentResolvable {
    if (typeof resolvable !== 'object') return false

    if ('file' in resolvable) {
      return DataResolver.isBufferResolvable(resolvable.file)
    }

    if ('url' in resolvable) {
      if (resolvable.url?.startsWith('https://')) return true
    }

    if ('id' in resolvable) {
      return typeof resolvable.id === 'string'!
    }

    return false
  }
}
