import {
  DirectMessagesChannel,
  GuildCategoryChannel,
  GuildNewsChannel,
  GuildNewsThreadChannel,
  GuildStoreChannel,
  GuildTextChannel,
  GuildThreadChannel
} from '@src/api/entities/channel'
import { ActivityEmoji, GuildEmoji, GuildPreviewEmoji, ReactionEmoji } from '@src/api/entities/emoji'
import { Presence, PresenceActivity, PresenceActivityAssets } from '@src/api/entities/presence'
import { GuildMember, ThreadMember } from '@src/api/entities/member'
import { PermissionOverwrite } from '@src/api/entities/overwrite'
import { Sticker, StickerPack } from '@src/api/entities/sticker'
import { MessageReaction } from '@src/api/entities/reaction'
import { Message } from '@src/api/entities/message'
import { User } from '@src/api/entities/user'
import { Role } from '@src/api/entities/role'

export const ExtendableEntities = {
  Message,
  User,
  ActivityEmoji,
  DirectMessagesChannel,
  GuildCategoryChannel,
  GuildEmoji,
  GuildMember,
  GuildPreviewEmoji,
  GuildStoreChannel,
  GuildTextChannel,
  GuildNewsChannel,
  GuildNewsThreadChannel,
  GuildThreadChannel,
  MessageReaction,
  PermissionOverwrite,
  Presence,
  PresenceActivity,
  PresenceActivityAssets,
  ReactionEmoji,
  Role,
  Sticker,
  StickerPack,
  ThreadMember,
}
