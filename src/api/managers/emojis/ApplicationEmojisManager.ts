import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { AnyEmoji, EntitiesCacheManager } from '@src/api'
import { DiscordApplication } from '@src/core'
import { Keyspaces } from '@src/constants'

export class ApplicationEmojisManager extends EntitiesManager {
  public cache: EntitiesCacheManager<AnyEmoji>

  constructor(app: DiscordApplication) {
    super(app)

    this.cache = new EntitiesCacheManager<AnyEmoji>(this.app, {
      entity: 'emojiEntityKey',
      keyspace: Keyspaces.GuildEmojis,
      storage: 'global',
      policy: 'emojis'
    })
  }
}