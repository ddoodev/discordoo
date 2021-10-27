import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { User } from '@src/api/entities/user/User'
import { RawMessageData } from '@src/api/entities/message/interfaces/RawMessageData'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json } from '@src/api/entities/interfaces/Json'

export class Message extends AbstractEntity {
  public id!: string
  public channelId!: string
  public content!: string
  public author?: User

  async init(data: RawMessageData): Promise<this> {
    console.log('MSG INIT DATA!!!!!!!11', data)
    this.id = data.id
    this.channelId = data.channel_id

    this.content = data.content ??= this.content

    if (data.author) {
      this.author = new User(this.client)
      await this.author.init(data.author)
    } else {
      this.author = undefined
    }

    return this
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({ ...properties, id: true, channelId: true, content: true, author: true }, obj)
  }
}
