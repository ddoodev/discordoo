import { BufferResolvable } from '@src/api/entities/interfaces/BufferResolvable'
import { ResolveBufferOptions } from '@src/utils/interfaces/ResolveBufferOptions'
import { request } from 'undici'
import { DiscordooError } from '@src/utils/DiscordooError'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

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
        if (/https?:\/\//.test(buffer)) {
          return request(buffer, options.fetchOptions).then(r => r.body.arrayBuffer())
        }
      }

      const filePath = path.resolve(buffer)
      return read(filePath)
    }

    throw new DiscordooError('DataResolver', 'do not know how to resolve buffer from:', typeof buffer)
  }
}
