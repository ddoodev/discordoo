import { BufferResolvable } from '@src/api/entities/interfaces/BufferResolvable'
import { ResolveBufferOptions } from '@src/utils/interfaces/ResolveBufferOptions'
import { request } from 'undici'
import { DiscordooError } from '@src/utils/DiscordooError'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import * as buffer from 'buffer'
import { MessageAttachmentResolvable } from '@src/api'

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

  static isBufferResolvable(resolvable: BufferResolvable): boolean {
    if (Buffer.isBuffer(resolvable) || resolvable instanceof ArrayBuffer) return true
    if (typeof resolvable === 'object' && typeof resolvable.pipe === 'function') return true

    return typeof resolvable === 'string' && (resolvable.startsWith('https://') || resolvable.startsWith('http://'))
  }

  static isMessageAttachmentResolvable(resolvable: MessageAttachmentResolvable) {
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
