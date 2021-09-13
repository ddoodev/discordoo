import { BufferResolvable } from '@src/api/entities/interfaces/BufferResolvable'
import { Readable } from 'stream'
import { ResolveBufferOptions } from '@src/utils/interfaces/ResolveBufferOptions'
import { request } from 'undici'
import { DiscordooError } from '@src/utils/DiscordooError'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const read = promisify(fs.readFile)

export class DataResolver {
  static async resolveBuffer(buffer: BufferResolvable, options?: ResolveBufferOptions): Promise<Buffer | ArrayBuffer> {
    if (Buffer.isBuffer(buffer)) return buffer

    if (buffer instanceof Readable) {
      const buffers: Buffer[] = []
      for await (const data of buffer) buffers.push(data)
      return Buffer.concat(buffers)
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
