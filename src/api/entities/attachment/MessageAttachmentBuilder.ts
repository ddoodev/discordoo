import { SPOILER_PREFIX } from '../../../../src/constants'
import { attach, BufferResolvable, randomString } from '../../../../src/utils'
import {
  MessageAttachment,
  MessageAttachmentBuilderData,
  MessageAttachmentBuilderOptions,
  RawMessageAttachmentData
} from '../../../../src/api'
import { RawAttachment } from '../../../../../providers/src/_index'
import { DataResolver } from '../../../../src/utils/DataResolver'

export class MessageAttachmentBuilder {
  declare file: BufferResolvable
  declare name: string
  private _options?: MessageAttachmentBuilderOptions

  constructor(
    data?: MessageAttachmentBuilderData | MessageAttachment | RawMessageAttachmentData,
    options?: MessageAttachmentBuilderOptions
  ) {
    attach(this, data, {
      props: [
        [ 'name', 'filename' ],
        [ 'file', 'url' ],
      ]
    })

    if (!this.name) this.name = `${randomString()}.png`

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

  get spoiler() {
    return this.name.startsWith(SPOILER_PREFIX)
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
