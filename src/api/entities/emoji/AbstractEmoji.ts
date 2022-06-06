import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { AbstractEmojiData } from '@src/api/entities/emoji/interfaces/AbstractEmojiData'
import { idToDate, idToTimestamp, attach } from '@src/utils'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json } from '@src/api/entities/interfaces/Json'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export abstract class AbstractEmoji extends AbstractEntity implements AbstractEmojiData {
  public animated?: boolean
  public id?: string
  public name?: string

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async init(data: AbstractEmojiData, options?: EntityInitOptions): Promise<this> {
    // options declared for the future
    attach(this, data, {
      props: [
        'animated',
        'id',
        'name'
      ],
    })

    return this
  }

  get identifier(): string {
    if (this.id) return `${this.animated ? 'a:' : ''}${this.name}:${this.id}`
    return encodeURIComponent(this.name!)
  }

  get createdTimestamp(): number | undefined {
    if (this.id) return idToTimestamp(this.id)
    return undefined
  }

  get createdDate(): Date | undefined {
    if (this.id) return idToDate(this.id)
    return undefined
  }

  get url(): string | undefined {
    if (this.id) return this.client.internals.rest.cdn.emoji(this.id, { format: this.animated ? 'gif' : 'png' })
    return undefined
  }

  toString(): string {
    return this.id ? `<${this.animated ? 'a' : ''}:${this.name}:${this.id}>` : (this.name ?? '__')
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      animated: true,
      id: true,
      name: true,
    }, obj)
  }
}
