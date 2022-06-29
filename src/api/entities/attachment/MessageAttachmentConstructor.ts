import { SPOILER_PREFIX } from '@src/constants'
import { attach, BufferResolvable, randomString, ValidationError } from '@src/utils'
import { MessageAttachmentConstructorData, MessageAttachmentConstructorOptions } from '@src/api'
import { RawAttachment } from '@discordoo/providers'
import { DataResolver } from '@src/utils/DataResolver'

export class MessageAttachmentConstructor {
  declare file: BufferResolvable
  declare name: string
  public spoiler = false
  private _options?: MessageAttachmentConstructorOptions

  constructor(data: MessageAttachmentConstructorData, options?: MessageAttachmentConstructorOptions) {
    if (!data.file) throw new ValidationError('MessageAttachmentConstructor', 'file is required')

    attach(this, data, {
      props: [
        'name',
        'spoiler',
        'file',
      ]
    })

    if (!data.name) this.name = `${randomString()}.png`

    this._options = options
  }

  setSpoiler(condition: boolean): this {
    switch (condition) {
      case true: {
        if (!this.name.startsWith(SPOILER_PREFIX)) this.name = SPOILER_PREFIX + this.name
      } break
      case false: {
        if (this.name.startsWith(SPOILER_PREFIX)) {
          while (this.spoiler) {
            this.name = this.name.slice(SPOILER_PREFIX.length)
          }
        }
      } break
    }

    return this
  }

  setName(name: string): this {
    this.name = this.spoiler ? SPOILER_PREFIX + name : name
    return this
  }

  setFile(file: BufferResolvable): this {
    this.file = file
    return this
  }

  async toRaw(): Promise<RawAttachment> {
    const data = await DataResolver.resolveBuffer(this.file, {
      fetch: this._options?.fetch,
      fetchOptions: this._options?.fetchOptions
    })

    return {
      data,
      name: this.name
    }
  }

}