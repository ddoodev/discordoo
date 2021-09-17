import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { MessageData } from '@src/api/entities/message/interfaces'
import { User } from '@src/api/entities/user/User'

export class Message extends AbstractEntity {
  public id!: string
  public channelID!: string
  public content?: string
  public author?: User

  // TODO
  /* get editable(): boolean {
    if (!this.author || !this.client.user) return false

    return this.author.id === this.client.user.id
  }*/

  async init(data: MessageData): Promise<this> {
    this.id = data.id
    this.channelID = data.channel_id

    this.content = data.content ??= this.content ??= undefined

    if (data.author) {
      this.author = new User(this.client)
      await this.author.init(data.author)
    } else {
      this.author = undefined
    }

    return this
  }
}
