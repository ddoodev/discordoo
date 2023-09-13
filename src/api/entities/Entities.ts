import {
  AbstractChannel,
  AbstractGuildChannel,
  AbstractGuildTextChannel,
  AbstractThreadChannel,
  DirectMessagesChannel,
  GuildCategoryChannel,
  GuildNewsChannel,
  GuildNewsThreadChannel,
  GuildStoreChannel,
  GuildTextChannel,
  GuildThreadChannel, InteractionResolvedChannel
} from '@src/api/entities/channel'
import { AbstractEmoji, ActivityEmoji, GuildEmoji, GuildPreviewEmoji, ReactionEmoji } from '@src/api/entities/emoji'
import { Presence, PresenceActivity, PresenceActivityAssets } from '@src/api/entities/presence'
import { GuildMember, ThreadMember } from '@src/api/entities/member'
import { PermissionOverwrite } from '@src/api/entities/overwrite'
import { Sticker, StickerPack } from '@src/api/entities/sticker'
import { MessageReaction } from '@src/api/entities/reaction'
import { Message } from '@src/api/entities/message'
import { User } from '@src/api/entities/user'
import { Role } from '@src/api/entities/role'
import { Guild, InviteGuild } from '@src/api/entities/guild'
import { AppCommandInteraction } from '@src/api/entities/interaction/interactions/AppCommandInteraction'
import { Interaction } from '@src/api/entities/interaction/interactions/Interaction'
import { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'
import { MessageEmbed } from '@src/api/entities/embed/MessageEmbed'
import { Invite } from '@src/api/entities/invite/Invite'
import { AppCommand } from '@src/api/entities/interaction/AppCommand'
import {
  ActionRowInteractionData,
  AutocompleteInteraction,
  ButtonInteractionData,
  MessageComponentInteraction,
  ModalSubmitInteraction,
  ModalSubmitInteractionData,
  SelectMenuInteractionData,
  TextInputInteractionData
} from '@src/api/entities/interaction/'
import { InteractionResolvedThreadChannel } from '@src/api/entities/channel/InteractionResolvedThreadChannel'
import { MessageAppCommandInteractionData } from '@src/api/entities/interaction/interactions/data/MessageAppCommandInteractionData'
import { ChatInputInteractionData } from '@src/api/entities/interaction/interactions/data/ChatInputInteractionData'
import { UserAppCommandInteractionData } from '@src/api/entities/interaction/interactions/data/UserAppCommandInteractionData'

export const Entities = {
  Message,
  User,
  ActivityEmoji,
  DirectMessagesChannel,
  GuildCategoryChannel,
  AbstractEmoji,
  GuildEmoji,
  GuildMember,
  GuildPreviewEmoji,
  GuildStoreChannel,
  GuildTextChannel,
  GuildNewsChannel,
  GuildNewsThreadChannel,
  AbstractChannel,
  AbstractGuildChannel,
  AbstractGuildTextChannel,
  AbstractThreadChannel,
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
  Guild,
  AppCommandInteraction,
  Interaction,
  MessageEmbed,
  MessageAttachment,
  Invite,
  InviteGuild,
  AppCommand,
  MessageComponentInteraction,
  SelectMenuInteractionData,
  ButtonInteractionData,
  AutocompleteInteraction,
  ModalSubmitInteraction,
  ModalSubmitInteractionData,
  TextInputInteractionData,
  ActionRowInteractionData,
  InteractionResolvedChannel,
  InteractionResolvedThreadChannel,
  MessageAppCommandInteractionData,
  ChatInputInteractionData,
  UserAppCommandInteractionData,
}
