import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { EmojiData, RawEmojiData } from '@src/api/entities/emoji/interfaces'
import { User } from '@src/api/entities/user'
import { resolveRoleId, resolveUser } from '@src/utils/resolve'
import { idToDate, idToTimestamp, mergeNewOrSave } from '@src/utils'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json } from '@src/api/entities/interfaces/Json'
import { ToJsonOverrideSymbol } from '@src/constants'

export class Emoji extends AbstractEntity implements EmojiData {
  public animated!: boolean
  public available!: boolean
  public id!: string | null
  public managed!: boolean
  public name!: string | null
  public requireColons!: boolean
  public roles: string[] = []
  public user?: User

  get identifier(): string | undefined {
    if (this.id) return `${this.animated ? 'a:' : ''}${this.name}:${this.id}`

    // !== null because name can possibly be ''
    if (this.name !== null) return encodeURIComponent(this.name)

    return void 100500
  }

  get createdTimestamp(): number | undefined {
    if (this.id) return idToTimestamp(this.id)
    return void 100500
  }

  get createdAt(): Date | undefined {
    if (this.id) return idToDate(this.id)
    return void 100500
  }

  toString(): string {
    return this.id ? `<${this.animated ? 'a' : ''}:${this.name}:${this.id}>` : (this.name ?? '__')
  }

  toJson(properties: ToJsonProperties, obj?: any): Json {
    return super.toJson({
      ...properties,
      animated: true,
      available: true,
      id: true,
      managed: true,
      name: true,
      requireColons: true,
      roles: true,
      userId: {
        override: ToJsonOverrideSymbol,
        value: this.user?.id
      }
    }, obj)
  }

  async init(data: EmojiData | RawEmojiData): Promise<this> {

    if (data.user !== undefined) {
      this.user = await resolveUser(this.client, data.user)
    } else if ('userId' in data && data.userId !== undefined) { // typings...
      this.user = await resolveUser(this.client, data.userId)
    }

    if (Array.isArray(data.roles)) {
      this.roles = data.roles.map(resolveRoleId)
    }

    mergeNewOrSave(this, data, [
      [ 'animated', '', false ],
      [ 'available', '', true ],
      [ 'managed', '', false ],
      [ 'name', '', null ],
      [ 'id', '', null ],
      [ 'requireColons', 'require_colons', false ],
    ])

    return this
  }
}
