import { MessageAttachmentResolvable } from '@src/api/entities/attachment/interfaces/MessageAttachmentResolvable'
import { RawAttachment } from '@discordoo/providers'
import { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'
import { ColorResolvable } from '@src/api/entities/interfaces/ColorResolvable'
import { EmptyBigBit, EmptyBit, GatewayIntents, PermissionFlags, RawColors } from '@src/constants'
import { DiscordooError } from '@src/utils/DiscordooError'
import { is } from 'typescript-is'
import { ValidationError } from '@src/utils/ValidationError'
import { MessageResolvable } from '@src/api/entities/message/interfaces/MessageResolvable'
import { ChannelResolvable } from '@src/api/entities/channel/interfaces/ChannelResolvable'
import { MessageEmbed, MessageEmbedResolvable, RawMessageEmbedData } from '@src/api/entities/embed'
import { GuildResolvable } from '@src/api/entities/guild/interfaces/GuildResolvable'
import { StickerResolvable } from '@src/api/entities/sticker'
import { BigBitFieldResolvable, BitFieldResolvable } from '@src/api/entities/bitfield/interfaces'
import { ReadonlyBigBitField } from '@src/api/entities/bitfield/ReadonlyBigBitField'
import { ReadonlyBitField } from '@src/api/entities/bitfield/ReadonlyBitField'
import { UserResolvable } from '@src/api/entities/user/interfaces/UserResolvable'
import { Client } from '@src/core'
import { RoleResolvable } from '@src/api/entities/role'
import { RoleTagsResolvable } from '@src/api/entities/role/interfaces/RoleTagsResolvable'
import { RoleTagsData } from '@src/api/entities/role/interfaces/RoleTagsData'
import { ShardListResolvable } from '@src/utils/interfaces'
import { range } from '@src/utils/range'
import { EmojiResolvable } from '@src/api'
import { MessageReactionResolvable } from '@src/api/entities/reaction/interfaces/MessageReactionResolvable'
import { PermissionOverwriteResolvable } from '@src/api/entities/overwrite/interfaces/PermissionOverwriteResolvable'
import { RawPermissionOverwriteData } from '@src/api/entities/overwrite/interfaces/RawPermissionOverwriteData'
import { ReplaceType } from '@src/utils/types'
import { PermissionOverwrite } from '@src/api/entities/overwrite/PermissionOverwrite'
import { GuildMemberResolvable } from '@src/api/entities/member/interfaces/GuildMemberResolvable'
import { MessageReaction } from '@src/api/entities/reaction/MessageReaction'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { MessageReferenceResolvable } from '@src/api/entities/message/interfaces/MessageReferenceResolvable'
import { RawMessageReferenceData } from '@src/api/entities/message/interfaces/RawMessageReferenceData'
import { ThreadMemberResolvable } from '@src/api/entities/member/interfaces/ThreadMemberResolvable'
import { GatewayIntentsResolvable } from '@src/gateway/interfaces/GatewayIntentsResolvable'

export function resolveFiles(resolvable: MessageAttachmentResolvable[]): Promise<RawAttachment[]> {
  return Promise.all(resolvable.map(resolveFile))
}

export function resolveFile(resolvable: MessageAttachmentResolvable): Promise<RawAttachment> {
  if (resolvable instanceof MessageAttachment) return resolvable.toRaw()

  return new MessageAttachment(resolvable).toRaw() // FIXME: low performance
}

export function resolveColor(resolvable: ColorResolvable): number {
  if (!is<ColorResolvable>(resolvable)) throw new ValidationError(undefined, 'Bad color:', resolvable)

  let result: any = RawColors.BLACK

  if (typeof resolvable === 'string') {
    switch (resolvable) {
      case 'DEFAULT':
        return RawColors.BLACK
      case 'RANDOM':
        return Math.floor(Math.random() * 16777215)
      default:
        result = RawColors[resolvable] ?? parseInt(resolvable.replace('#', ''), 16)
    }
  } else if (Array.isArray(resolvable)) {
    result = (resolvable[0] << 16) + (resolvable[1] << 8) + resolvable[2]
  }

  if (typeof result !== 'number' || isNaN(result) || result < 0 || result > 16777215) {
    throw new DiscordooError(undefined, 'Bad color:', resolvable)
  }

  return result
}

const InvalidBitFieldError = (invalid: any) => new DiscordooError(undefined, 'Invalid BitField:', invalid)

export function resolveBigBitField(resolvable: BigBitFieldResolvable, emptyBit: bigint = EmptyBigBit): bigint {
  if (Array.isArray(resolvable)) {
    return resolvable.reduce<bigint>((prev, curr) => {
      return prev | resolveBigBitField(curr, emptyBit)
    }, emptyBit)
  }

  switch (typeof resolvable) {
    case 'number': {
      if (isNaN(resolvable) || resolvable === Infinity) throw InvalidBitFieldError(resolvable)
      return BigInt(resolvable)
    }
    case 'bigint':
      return resolvable
    case 'string': {
      try {
        if (resolvable.endsWith('n')) return BigInt(resolvable.slice(0, resolvable.length - 1))
        return BigInt(resolvable)
      } catch (e) {
        throw new DiscordooError('BigBitFieldResolvable', 'Cannot convert', resolvable, 'to big bitfield.')
      }
    }
    case 'object': {
      if (resolvable instanceof ReadonlyBigBitField) return resolvable.bitfield
      if (typeof resolvable?.bits === 'string' && resolvable.bits?.endsWith('n'))
        return BigInt(resolvable.bits.slice(0, resolvable.bits.length))
    } break
  }

  throw InvalidBitFieldError(resolvable)
}

export function resolveBitField(resolvable: BitFieldResolvable, emptyBit: number = EmptyBit): number {
  if (Array.isArray(resolvable)) {
    return resolvable.reduce<number>((prev, curr) => {
      return prev | resolveBitField(curr, emptyBit)
    }, emptyBit)
  }

  switch (typeof resolvable) {
    case 'number': {
      if (isNaN(resolvable) || resolvable === Infinity) throw InvalidBitFieldError(resolvable)
      return resolvable
    }
    case 'object': {
      if (resolvable instanceof ReadonlyBitField) return resolvable.bitfield
      if (typeof resolvable.bits === 'number'!) return resolvable.bits
    }
  }

  throw InvalidBitFieldError(resolvable)
}

export function resolveEmbedToRaw(resolvable: MessageEmbedResolvable): RawMessageEmbedData {
  if (resolvable instanceof MessageEmbed) return resolvable.toJson()

  return new MessageEmbed(resolvable).toJson() // FIXME: low performance
}

export function resolvePermissionOverwriteToRaw(
  resolvable: PermissionOverwriteResolvable, existing?: PermissionOverwrite
): RawPermissionOverwriteData {

  const result: ReplaceType<RawPermissionOverwriteData, 'allow' | 'deny', bigint> = {
    id: resolvable.id,
    type: resolvable.type,
    allow: existing?.allow?.bitfield ?? EmptyBigBit,
    deny: existing?.deny?.bitfield ?? EmptyBigBit,
  }

  if ('allow' in resolvable) {
    result.allow |= resolveBigBitField(resolvable.allow)
    result.deny |= resolveBigBitField(resolvable.deny)
  } else {
    let { allow, deny } = result

    for (const [ key, action ] of Object.entries(resolvable)) {
      if (PermissionFlags[key] === undefined) continue

      switch (action as boolean | null) {
        case true:
          allow |= PermissionFlags[key] // add to allow
          deny &= (~(PermissionFlags[key] | EmptyBigBit)) // remove from deny
          break
        case false:
          deny |= PermissionFlags[key] // add to deny
          allow &= (~(PermissionFlags[key] | EmptyBigBit)) // remove from allow
          break
        case null:
          allow &= (~(PermissionFlags[key] | EmptyBigBit)) // remove from allow
          deny &= (~(PermissionFlags[key] | EmptyBigBit)) // remove from deny
          break
      }
    }

    result.allow = allow
    result.deny = deny
  }

  return { ...result, deny: result.deny.toString(), allow: result.allow.toString() }
}

export async function resolveMessageReaction(client: Client, resolvable: MessageReactionResolvable): Promise<MessageReaction | undefined> {
  if (!resolvable) return undefined

  const MessageReaction = EntitiesUtil.get('MessageReaction')

  if (resolvable instanceof MessageReaction) return resolvable

  return resolvable.message && resolvable.emoji && resolvable.channel ? new MessageReaction(client).init(resolvable) : undefined
}

export function resolveRoleTags(resolvable: RoleTagsResolvable): RoleTagsData {
  return {
    botId:
      'bot_id' in resolvable ? resolvable.bot_id : 'botId' in resolvable ? resolvable.botId : undefined,
    integrationId:
      'integration_id' in resolvable ? resolvable.integration_id : 'integrationId' in resolvable ? resolvable.integrationId : undefined,
    premiumSubscriber:
      'premium_subscriber' in resolvable ? true : 'premiumSubscriber' in resolvable ? resolvable.premiumSubscriber : false
  }
}

export function resolveGatewayIntents(resolvable: GatewayIntentsResolvable | undefined): number {
  if (typeof resolvable === 'undefined') {
    throw new ValidationError(undefined, 'Incorrect gateway intents specified:', resolvable)
  }

  return Array.isArray(resolvable)
    ? (resolvable as number[]).reduce((prev, curr) => prev | curr, 0)
    : resolvable
}

function resolveAnythingToId(resolvable: any): string | undefined  {
  if (resolvable && typeof resolvable === 'string') return resolvable

  return resolvable?.id
}

export function resolveMessageId(resolvable: MessageResolvable): string | undefined  {
  return resolveAnythingToId(resolvable)
}

export function resolveChannelId(resolvable: ChannelResolvable): string | undefined  {
  return resolveAnythingToId(resolvable)
}

export function resolveGuildId(resolvable: GuildResolvable): string | undefined {
  return resolveAnythingToId(resolvable)
}

export function resolveStickerId(resolvable: StickerResolvable): string | undefined  {
  return resolveAnythingToId(resolvable)
}

export function resolveUserId(resolvable: UserResolvable): string | undefined  {
  return resolveAnythingToId(resolvable)
}

export function resolveUserOrMemberId(resolvable: UserResolvable | GuildMemberResolvable | ThreadMemberResolvable): string | undefined {
  return resolveMemberId(resolvable as any) ?? resolveUserId(resolvable as any)
}

export function resolveRoleId(resolvable: RoleResolvable): string | undefined  {
  return resolveAnythingToId(resolvable)
}

export function resolveEmojiId(resolvable: EmojiResolvable | MessageReactionResolvable): string | undefined {
  if (typeof resolvable === 'string') return resolvable

  if ('emoji' in resolvable) {
    if ('emojiId' in resolvable) {
      return resolvable.emojiId
    }

    return resolveEmojiId(resolvable.emoji)
  }

  // sometimes I hate typings
  if ('id' in resolvable && resolvable.id) {
    return `${resolvable.animated ? 'a:' : ''}${resolvable.name}:${resolvable.id}`
  } else if ('name' in resolvable && resolvable.name) {
    return encodeURIComponent(resolvable.name)
  }

  return undefined
}

export function resolveMemberId(member: GuildMemberResolvable | ThreadMemberResolvable): string | undefined {
  if (typeof member === 'string') return member

  if (typeof member === 'object') {
    if ('userId' in member) return member.userId
    if ('user' in member && member.user) return resolveUserId(member.user)
    if ('user_id' in member) return member.user_id
  }

  return undefined
}

export function resolveDiscordShards(shards: ShardListResolvable): number[] {
  const source = 'DiscordShardListResolver'
  let result: number[] = []

  switch (typeof shards) {
    case 'number':
      result = range(shards)
      break

    case 'string':
      if (!isNaN(parseInt(shards))) {
        result = range(parseInt(shards))
      } else {
        throw new DiscordooError(source, 'received disallowed shard list type: string, value:', shards)
      }
      break

    case 'object':
      if (Array.isArray(shards)) {
        const arr = shards.filter(v => typeof v !== 'number'! || isNaN(v))
        if (arr.length) {
          throw new DiscordooError(source, 'array of shards contains non-number value. array:', shards)
        }

        result = shards
      } else {
        if (typeof shards.from !== 'number'! || typeof shards.to !== 'number'!) {
          throw new DiscordooError(source, 'received object as shard list, but shards.from or shards.to is not a number.')
        }

        shards = range(shards.from, shards.to)
      }
      break

    default:
      throw new DiscordooError(source, 'received disallowed shard list type:', typeof shards)
  }

  return result
}

type ShardsInfo = {
  shards: number[]
  totalShards: number
}

export function resolveDiscordooShards(
  client: Client | ShardsInfo, shards: ShardListResolvable | 'all' | 'current'
): number[] {
  const source = 'DiscordooShardListResolver'
  let result: number[] = []

  const info: ShardsInfo = client instanceof Client ? {
    shards: client.internals.sharding.shards,
    totalShards: client.internals.sharding.totalShards,
  } : client

  switch (typeof shards) {
    case 'string': {
      switch (true) {
        case shards === 'all':
          result = range(info.totalShards)
          break

        case shards === 'current':
          result = [ ...info.shards ]
          break

        case !isNaN(parseInt(shards)):
          result = [ parseInt(shards) ]
          break

        default:
          throw new DiscordooError(source, 'do not know how to resolve shards from this string:', shards)
      }
    } break

    case 'object':
      if (Array.isArray(shards)) {
        if (shards.findIndex(v => typeof v !== 'number'! || isNaN(v)) !== -1) {
          throw new DiscordooError(source, 'array of shards contains non-number value. array:', shards)
        }

        result = shards
      } else {
        const shardsIsNaN = new DiscordooError(source, 'received object as shard list, but shards.from or shards.to is not a number.')

        if (typeof shards.from !== 'number'! || typeof shards.to !== 'number'!) {
          throw shardsIsNaN
        }

        if (isNaN(shards.from) || isNaN(shards.to)) {
          throw shardsIsNaN
        }

        result = range(shards.from, shards.to)
      }
      break

    case 'number':
      result = [ shards ]
      break

    default:
      throw new DiscordooError(source, 'do not know how to resolve shards from', typeof shards + '.', 'Provided shards:', shards)
  }

  return result
}

export function resolveMessageReferenceToRaw(resolvable: MessageReferenceResolvable): RawMessageReferenceData {
  const data: any = resolvable

  return {
    guild_id: data.guildId ?? data.guild_id ?? resolveGuildId(data.guild),
    channel_id: data.channelId ?? data.channel_id ?? resolveChannelId(data.channel),
    message_id: data.id ?? data.messageId ?? data.message_id ?? resolveMessageId(data.message)
  }
}

// TODO: resolveComponents
