import { AbstractEntity } from '@src/api/entities/AbstractEntity'

export class GuildMember extends AbstractEntity {
  init(data: any): Promise<this> {
    return Promise.resolve(this)
  }
}
