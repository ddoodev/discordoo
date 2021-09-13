import { MessageAttachmentResolvable } from '@src/api/entities/attachment/interfaces/MessageAttachmentResolvable'
import { RawAttachment } from '@discordoo/providers'
import { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'
import { DataResolver } from '@src/utils/DataResolver'

export async function resolveFiles(resolvable: MessageAttachmentResolvable[]): Promise<RawAttachment[]> {
  const result: Promise<RawAttachment>[] = resolvable.map(async res => {
    if (res instanceof MessageAttachment) return res.toRaw()

    // @ts-ignore
    return { name: res.name ?? '', data: res.data ?? await DataResolver.resolveBuffer(res) }
  })

  return Promise.all(result)
}

// TODO: resolveEmbeds, resolveStickers, resolveComponents
