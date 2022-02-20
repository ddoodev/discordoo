import { AbstractEventContext } from '@src/events'
import { Collection } from '@discordoo/collection'
import { GuildEmoji } from '@src/api'

export interface GuildEmojiUpdatedContext {
  stored: GuildEmoji
  updated: GuildEmoji
}

/**
 * Context to the `guildEmojisUpdate` event.
 *
 * **Please keep in mind that the fields** `added`, `updated` **and** `removed` **are calculated based on the current cache.**
 *
 * If the emojis cache is disabled, each event will perceive all emojis sent by discord as newly added and add them to the `added` field.
 * */
export interface GuildEmojisUpdatedEventContext extends AbstractEventContext {
  guildId: string
  added: Collection<string, GuildEmoji>
  updated: Collection<string, GuildEmojiUpdatedContext>
  removed: Collection<string, GuildEmoji>
}