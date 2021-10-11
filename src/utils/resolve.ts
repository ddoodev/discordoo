import { MessageAttachmentResolvable } from '@src/api/entities/attachment/interfaces/MessageAttachmentResolvable'
import { RawAttachment } from '@discordoo/providers'
import { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'
import { DataResolver } from '@src/utils/DataResolver'
import { ColorResolvable } from '@src/api/entities/interfaces/ColorResolvable'
import { EmptyBigBit, EmptyBit, RawColors } from '@src/constants'
import { DiscordooError } from '@src/utils/DiscordooError'
import { is } from 'typescript-is'
import { ValidationError } from '@src/utils/ValidationError'
import { MessageResolvable } from '@src/api/entities/message/interfaces/MessageResolvable'
import { ChannelResolvable } from '@src/api/entities/channel/interfaces/ChannelResolvable'
import { MessageEmbed, MessageEmbedResolvable, RawMessageEmbedData } from '@src/api/entities/embed'
import { GuildResolvable } from '@src/api/entities/guild/interfaces/GuildResolvable'
import { MessageStickerResolvable } from '@src/api/entities/sticker'
import { BigBitFieldResolvable, BitFieldResolvable } from '@src/api/entities/bitfield/interfaces'
import { BigBitField } from '@src/api/entities/bitfield/BigBitField'
import { BitField } from '@src/api/entities/bitfield/BitField'

export function resolveFiles(resolvable: MessageAttachmentResolvable[]): Promise<RawAttachment[]> {
  return Promise.all(resolvable.map(resolveFile))
}

export async function resolveFile(resolvable: MessageAttachmentResolvable): Promise<RawAttachment> {
  if (resolvable instanceof MessageAttachment) return resolvable.toRaw()

  // @ts-ignore
  return { name: res.name ?? 'attachment', data: res.data ?? await DataResolver.resolveBuffer(res), ephemeral: res.ephemeral ?? false }
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
    case 'string':
      if (resolvable.endsWith('n')) return BigInt(resolvable.slice(0, resolvable.length - 1))
      break
    case 'object': {
      if (resolvable instanceof BigBitField) return resolvable.bitfield
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
      if (resolvable instanceof BitField) return resolvable.bitfield
      if (typeof resolvable.bits === 'number') return resolvable.bits
    }
  }

  throw InvalidBitFieldError(resolvable)
}

// TODO: optimize

export function resolveMessage(resolvable: MessageResolvable): string {
  if (typeof resolvable === 'string') return resolvable

  return resolvable.id
}

export function resolveChannel(resolvable: ChannelResolvable): string {
  if (typeof resolvable === 'string') return resolvable

  return resolvable.id
}

export function resolveGuild(resolvable: GuildResolvable): string {
  if (typeof resolvable === 'string') return resolvable

  return resolvable.id
}

export function resolveSticker(resolvable: MessageStickerResolvable): string {
  if (typeof resolvable === 'string') return resolvable

  return resolvable.id
}

export function resolveEmbed(resolvable: MessageEmbedResolvable): RawMessageEmbedData {
  if (resolvable instanceof MessageEmbed) return resolvable.toJson()

  return new MessageEmbed(resolvable).toJson() // TODO: low performance
}

// TODO: resolveEmbeds, resolveStickers, resolveComponents
