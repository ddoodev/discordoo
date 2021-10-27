import { Message } from '@src/api/entities/message/Message'
import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import { User } from '@src/api/entities/user'
import { Sticker, StickerPack } from '@src/api/entities/sticker'
import { Role } from '@src/api/entities/role'
import { Presence } from '@src/api/entities/presence/Presence'
import { GuildMember } from '@src/api/entities/member'
import { MessageReaction } from '@src/api/entities/reaction/MessageReaction'
import { AbstractEmoji, ActivityEmoji, GuildEmoji, ReactionEmoji } from '@src/api/entities/emoji'

export const Entities = {
  Message,
  AbstractChannel,
  User,
  Sticker,
  Role,
  Presence,
  GuildMember,
  StickerPack,
  MessageReaction,
  AbstractEmoji,
  ActivityEmoji,
  GuildEmoji,
  ReactionEmoji,
}
