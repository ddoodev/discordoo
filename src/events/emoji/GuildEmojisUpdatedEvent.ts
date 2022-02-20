import { AbstractEvent } from '@src/events'
import { EventNames } from '@src/constants'
import { RawGuildEmojisUpdatedEventData } from '@src/events/emoji/RawGuildEmojisUpdatedEventData'
import { EntitiesUtil, GuildEmoji } from '@src/api'
import { Collection } from '@discordoo/collection'
import { GuildEmojisUpdatedEventContext, GuildEmojiUpdatedContext } from '@src/events/emoji/ctx/GuildEmojisUpdatedEventContext'

export class GuildEmojisUpdatedEvent extends AbstractEvent {
  public name = EventNames.GUILD_EMOJIS_UPDATE

  async execute(shardId: number, data: RawGuildEmojisUpdatedEventData) {

    const cache = await this.client.emojis.cache.entries<GuildEmoji>({ storage: data.guild_id }),
      added: Collection<string, GuildEmoji> = new Collection(),
      updated: Collection<string, GuildEmojiUpdatedContext> = new Collection(),
      removed: Collection<string, GuildEmoji> = new Collection(),
      Emoji = EntitiesUtil.get('GuildEmoji')

    const snapshot = cache.map(e => e[0])
    let deleted = 0

    for await (const emojiData of data.emojis) {
      const index = snapshot.indexOf(emojiData.id)

      if (index > -1) {
        const cachedEmoji = cache[index + deleted][1]

        deleted++
        snapshot.splice(index, 1)

        const equals = cachedEmoji.equals(emojiData)
        if (!equals) {
          const clone = await (await cachedEmoji._clone()).init(emojiData)
          updated.set(emojiData.id, {
            updated: clone,
            stored: cachedEmoji
          })
          await this.client.emojis.cache.set(emojiData.id, clone, { storage: data.guild_id })
        }

      } else {
        const emoji = await new Emoji(this.client).init(emojiData)
        await this.client.emojis.cache.set(emojiData.id, emoji, { storage: data.guild_id })
        added.set(emojiData.id, emoji)
      }
    }

    for (let i = 0; i < snapshot.length; i++) {
      const emoji = cache[i + deleted]

      if (emoji) {
        removed.set(emoji[0], emoji[1])
      }
    }

    await this.client.emojis.cache.delete(snapshot, { storage: data.guild_id })

    const context: GuildEmojisUpdatedEventContext = {
      updated,
      added,
      removed,
      shardId,
      guildId: data.guild_id
    }

    this.client.emit(EventNames.GUILD_EMOJIS_UPDATE, context)
  }
}