import { EntitiesCacheManager, EntitiesManager, Message } from '@src/api'
import { Client } from '@src/core'
import { MessagesManagerData } from '@src/api/managers/interfaces/MessagesManagerData'

export class MessagesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Message>

  constructor(client: Client, data: MessagesManagerData) {
    super(client)

    this.cache = new EntitiesCacheManager<Message>(this.client, {
      keyspace: 'messages',
      storage: data.id,
      entity: 'Message',
      policy: 'messages'
    })
  }
}
