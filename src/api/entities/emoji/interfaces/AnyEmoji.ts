import { AbstractEmoji, ActivityEmoji, GuildEmoji, GuildPreviewEmoji, ReactionEmoji } from '@src/api'

export type AnyEmoji = AbstractEmoji | ActivityEmoji | GuildEmoji | GuildPreviewEmoji | ReactionEmoji
