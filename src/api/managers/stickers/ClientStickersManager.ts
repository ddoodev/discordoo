import { EntitiesCacheManager, EntitiesManager, EntitiesUtil } from '@src/api'
import { Client } from '@src/core'
import { Sticker, StickerPack, StickerResolvable } from '@src/api/entities/sticker'
import { StickerCreateData } from '@src/api/entities/sticker/interfaces/StickerCreateData'
import { RawStickerCreateData } from '@src/api/entities/sticker/interfaces/RawStickerCreateData'
import { GuildResolvable } from '@src/api/entities/guild/interfaces/GuildResolvable'
import { resolveGuildId, resolveStickerId } from '@src/utils/resolve'
import { DataResolver } from '@src/utils/DataResolver'
import { StickerEditData } from '@src/api/entities/sticker/interfaces/StickerEditData'
import { RawStickerEditData } from '@src/api/entities/sticker/interfaces/RawStickerEditData'
import { DiscordooError } from '@src/utils'
import { Collection } from '@discordoo/collection'

export class ClientStickersManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Sticker>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<Sticker>(this.client, {
      entity: 'Sticker',
      storage: 'global',
      keyspace: 'stickers',
      policy: 'stickers'
    })
  }

  async fetch(sticker: StickerResolvable): Promise<Sticker | undefined> {
    const stickerId = resolveStickerId(sticker)

    if (!stickerId) throw new DiscordooError('ClientStickersManager#fetch', 'Cannot fetch sticker without guild id.')

    const response = await this.client.internals.actions.getSticker(stickerId)
    const Sticker = EntitiesUtil.get('Sticker')

    if (response.success) {
      const sticker = await new Sticker(this.client).init(response.result)
      await this.cache.set(sticker.id, sticker)
      return sticker
    }

    return undefined
  }

  async fetchMany(guild: GuildResolvable): Promise<Sticker[] | undefined> {
    const guildId = resolveGuildId(guild)

    if (!guildId) throw new DiscordooError('ClientStickersManager#fetchMany', 'Cannot fetch guild stickers without guild id.')

    const response = await this.client.internals.actions.getGuildStickers(guildId)
    const Sticker = EntitiesUtil.get('Sticker')

    if (response.success) {
      const result: Sticker[] = []

      for await (const data of response.result) {
        const sticker = await new Sticker(this.client).init(data)
        await this.cache.set(sticker.id, sticker, { storage: guildId })
        result.push(sticker)
      }

      return result
    }

    return undefined
  }

  async fetchPacks(): Promise<Collection<string, StickerPack> | undefined> {
    const response = await this.client.internals.actions.getNitroStickerPacks(),
      collection = new Collection(),
      StickerPack = EntitiesUtil.get('StickerPack')

    if (response.success) {
      for await (const stickerPackData of response.result) {
        const stickerPack = await new StickerPack(this.client).init(stickerPackData)
        collection.set(stickerPack.id, stickerPack)
      }

      return collection
    }

    return undefined
  }

  async edit(
    guild: GuildResolvable, sticker: StickerResolvable, data: StickerEditData | RawStickerEditData, reason?: string
  ): Promise<Sticker | undefined> {
    const stickerId = resolveStickerId(sticker),
      guildId = resolveGuildId(guild)

    if (!stickerId) throw new DiscordooError('ClientStickersManager#edit', 'Cannot edit sticker without id.')
    if (!guildId) throw new DiscordooError('ClientStickersManager#edit', 'Cannot edit sticker without guild id.')

    const payload: RawStickerEditData = {
      name: data.name,
      tags: typeof data.tags === 'string' ? data.tags : (data.tags?.join(', ') ?? ''),
      description: data.description
    }

    const response = await this.client.internals.actions.editGuildSticker(guildId, stickerId, payload, reason)
    const Sticker = EntitiesUtil.get('Sticker')

    if (response.success) {
      return await new Sticker(this.client).init(response.result)
    }

    return undefined
  }

  async create(guild: GuildResolvable, data: StickerCreateData | RawStickerCreateData, reason?: string): Promise<Sticker | undefined> {
    const guildId = resolveGuildId(guild)

    if (!guildId) throw new DiscordooError('ClientStickersManager#create', 'Cannot create sticker without guild id.')

    const payload: RawStickerCreateData = {
      name: data.name,
      description: data.description ?? '',
      tags: typeof data.tags === 'string' ? data.tags : data.tags.join(', '),
      // @ts-ignore
      file: await DataResolver.resolveBuffer(data.file.file ?? data.file)
    }

    const response = await this.client.internals.actions.createGuildSticker(guildId, payload, reason)
    const Sticker = EntitiesUtil.get('Sticker')

    if (response.success) {
      const sticker = await new Sticker(this.client).init(response.result)
      await this.cache.set(sticker.id, sticker)
      return sticker
    }

    return undefined
  }

  async delete(guild: GuildResolvable, sticker: StickerResolvable, reason?: string): Promise<boolean> {
    const stickerId = resolveStickerId(sticker),
      guildId = resolveGuildId(guild)

    if (!stickerId) throw new DiscordooError('ClientStickersManager#delete', 'Cannot delete sticker without id.')
    if (!guildId) throw new DiscordooError('ClientStickersManager#delete', 'Cannot delete sticker without guild id.')

    const response = await this.client.internals.actions.deleteGuildSticker(guildId, stickerId, reason)

    if (response.success) {
      await this.cache.delete(stickerId)
      return true
    }

    return false
  }

}
