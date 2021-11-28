import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { AnyEmoji, EntitiesCacheManager } from '@src/api'
import { Client } from '@src/core'
import { Keyspaces } from '@src/constants'

export class ClientEmojisManager extends EntitiesManager {
  public cache: EntitiesCacheManager<AnyEmoji>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<AnyEmoji>(this.client, {
      entity: 'emojiEntityKey',
      keyspace: Keyspaces.GUILD_EMOJIS,
      storage: 'global',
      policy: 'emojis'
    })
  }
}