import { MessageAttachmentResolvable } from '@src/api/entities/attachment/interfaces/MessageAttachmentResolvable'
import { RawAttachment } from '@discordoo/providers'
import { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'
import { ColorResolvable } from '@src/api/entities/interfaces/ColorResolvable'
import { EmptyBigBit, EmptyBit, RawColors } from '@src/constants'
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
import { User } from '@src/api/entities/user'
import { Client } from '@src/core'
import { RoleResolvable } from '@src/api/entities/role'
import { RoleTagsResolvable } from '@src/api/entities/role/interfaces/RoleTagsResolvable'
import { RoleTagsData } from '@src/api/entities/role/interfaces/RoleTagsData'

export function resolveFiles(resolvable: MessageAttachmentResolvable[]): Promise<RawAttachment[]> {
  return Promise.all(resolvable.map(resolveFile))
}

export function resolveFile(resolvable: MessageAttachmentResolvable): Promise<RawAttachment> {
  if (resolvable instanceof MessageAttachment) return resolvable.toRaw()

  return new MessageAttachment(resolvable).toRaw() // TODO: low performance
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
      if (typeof resolvable.bits === 'string' && resolvable.bits.endsWith('n'))
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

  return new MessageEmbed(resolvable).toJson() // TODO: low performance
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

function resolveAnythingToId(resolvable: any): string | undefined  {
  if (typeof resolvable === 'string') return resolvable

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

export function resolveRoleId(resolvable: RoleResolvable): string | undefined  {
  return resolveAnythingToId(resolvable)
}

export async function resolveUser(client: Client, resolvable: UserResolvable): Promise<User | undefined> {
  if (resolvable instanceof User) return resolvable

  const id = resolveUserId(resolvable)
  if (id) return client.users.cache.get(id)

  return undefined
}

// TODO: resolveComponents
