import { Message } from '@src/api/entities/message/Message'
import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import { User } from '@src/api/entities/user'
import { Sticker, StickerPack } from '@src/api/entities/sticker'
import { Role } from '@src/api/entities/role'
import { Presence } from '@src/api/entities/presence/Presence'
import { GuildMember } from '@src/api/entities/member'
import { MessageReaction } from '@src/api/entities/reaction/MessageReaction'
import { AbstractEmoji, ActivityEmoji, GuildEmoji, GuildPreviewEmoji, ReactionEmoji } from '@src/api/entities/emoji'
import { PermissionOverwrite } from '@src/api/entities/overwrites/PermissionOverwrite'
import { GuildCategoryChannel } from '@src/api/entities/channel/GuildCategoryChannel'
import { DirectMessagesChannel } from '@src/api/entities/channel/DirectMessagesChannel'
import { AbstractGuildChannel } from '@src/api/entities/channel/AbstractGuildChannel'
import { AbstractGuildTextChannel } from '@src/api/entities/channel/AbstractGuildTextChannel'
import { GuildTextChannel } from '@src/api/entities/channel/GuildTextChannel'
import { ThreadMember } from '@src/api/entities/member/ThreadMember'
import { GuildNewsChannel } from '@src/api/entities/channel/GuildNewsChannel'
import { GuildNewsThreadChannel } from '@src/api/entities/channel/GuildNewsThreadChannel'
import { GuildThreadChannel } from '@src/api/entities/channel/GuildThreadChannel'

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
  PermissionOverwrite,
  GuildCategoryChannel,
  DirectMessagesChannel,
  AbstractGuildChannel,
  AbstractGuildTextChannel,
  GuildTextChannel,
  ThreadMember,
  GuildNewsChannel,
  GuildNewsThreadChannel,
  GuildThreadChannel,
  GuildPreviewEmoji,
}
