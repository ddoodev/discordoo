import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { UserData } from '@src/api/entities/user/interfaces'
import { idToDate } from '@src/utils'

export class User extends AbstractEntity implements UserData {
  id!: string
  bot!: boolean
  system!: boolean
  avatar!: string | null
  discriminator!: string | null
  username!: string | null

  get createdAt(): Date {
    return idToDate(this.id)
  }

  get createdTimestamp(): number {
    return this.createdAt.getTime()
  }

  get tag(): string {
    return `${this.username ?? 'unknown'}#${this.discriminator ?? '0000'}`
  }

  toString(): string {
    return `<@${this.id}>`
  }

  init(data: UserData): Promise<this> {
    this.id = data.id

    this.avatar = data.avatar ??= this.avatar ??= null
    this.username = data.username ??= this.username ??= null
    this.discriminator = data.discriminator ??= this.discriminator ??= null

    if (typeof data.bot === 'boolean') {
      this.bot = data.bot
    } else {
      this.bot = false
    }

    if (typeof data.system === 'boolean') {
      this.system = data.system
    } else {
      this.system = false
    }

    return Promise.resolve(this)
  }

}
