import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { AbstractEmojiData } from '@src/api/entities/emoji/interfaces/AbstractEmojiData'
import { idToDate, idToTimestamp, attach } from '@src/utils'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json } from '@src/api/entities/interfaces/Json'

export abstract class AbstractEmoji extends AbstractEntity implements AbstractEmojiData {
  public animated?: boolean
  public id?: string
  public name?: string

  async init(data: AbstractEmojiData): Promise<this> {
    attach(this, data, [
      'animated',
      'id',
      'name'
    ])

    return this
  }

  get identifier(): string | undefined {
    if (this.id) return `${this.animated ? 'a:' : ''}${this.name}:${this.id}`

    // !== undefined because name can possibly be ''
    if (this.name !== undefined) return encodeURIComponent(this.name)

    return undefined
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
    if (this.id) return this.client.internals.rest.cdn().emoji(this.id, { format: this.animated ? 'gif' : 'png' })
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
