import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { AbstractEmojiData } from '@src/api/entities/emoji/interfaces/AbstractEmojiData'
import { idToDate, idToTimestamp, mergeNewOrSave } from '@src/utils'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json } from '@src/api/entities/interfaces/Json'

export abstract class AbstractEmoji extends AbstractEntity implements AbstractEmojiData {
  public animated!: boolean | null
  public id!: string | null
  public name!: string | null

  async init(data: AbstractEmojiData): Promise<this> {
    mergeNewOrSave(this, data, [
      [ 'animated', '', null ],
      [ 'id', '', null ],
      [ 'name', '', null ]
    ])

    return this
  }

  get identifier(): string | undefined {
    if (this.id) return `${this.animated ? 'a:' : ''}${this.name}:${this.id}`

    // !== null because name can possibly be ''
    if (this.name !== null) return encodeURIComponent(this.name)

    return undefined
  }

  get createdTimestamp(): number | undefined {
    if (this.id) return idToTimestamp(this.id)
    return undefined
  }

  get createdAt(): Date | undefined {
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

  toJson(properties: ToJsonProperties, obj?: any): Json {
    return super.toJson({
      ...properties,
      animated: true,
      id: true,
      name: true,
    }, obj)
  }
}
