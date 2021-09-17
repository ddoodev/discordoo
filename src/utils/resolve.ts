import { MessageAttachmentResolvable } from '@src/api/entities/attachment/interfaces/MessageAttachmentResolvable'
import { RawAttachment } from '@discordoo/providers'
import { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'
import { DataResolver } from '@src/utils/DataResolver'
import { ColorResolvable } from '@src/api/entities/interfaces/ColorResolvable'
import { RawColors } from '@src/constants'
import { DiscordooError } from '@src/utils/DiscordooError'
import { is } from 'typescript-is'
import { ValidationError } from '@src/utils/ValidationError'

export async function resolveFiles(resolvable: MessageAttachmentResolvable[]): Promise<RawAttachment[]> {
  const result: Promise<RawAttachment>[] = resolvable.map(async res => {
    if (res instanceof MessageAttachment) return res.toRaw()

    // @ts-ignore
    return { name: res.name ?? '', data: res.data ?? await DataResolver.resolveBuffer(res) }
  })

  return Promise.all(result)
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



// TODO: resolveEmbeds, resolveStickers, resolveComponents
