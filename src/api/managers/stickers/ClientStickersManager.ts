import { Collection } from '@discordoo/collection'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { EntitiesCacheManager } from '@src/api/managers/EntitiesCacheManager'
import { Sticker } from '@src/api/entities/sticker/Sticker'
import { Client } from '@src/core/client/Client'
import { StickerResolvable } from '@src/api/entities/sticker/interfaces/StickerResolvable'
import { resolveGuildId, resolveStickerId } from '@src/utils/resolve'
import { DiscordooError } from '@src/utils/DiscordooError'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { GuildResolvable } from '@src/api/entities/guild/interfaces/GuildResolvable'
import { StickerPack } from '@src/api/entities/sticker/StickerPack'
import { StickerEditData } from '@src/api/entities/sticker/interfaces/StickerEditData'
import { RawStickerEditData } from '@src/api/entities/sticker/interfaces/RawStickerEditData'
import { StickerCreateData } from '@src/api/entities/sticker/interfaces/StickerCreateData'
import { RawStickerCreateData } from '@src/api/entities/sticker/interfaces/RawStickerCreateData'
import { Keyspaces } from '@src/constants'
import { StickersManagerEditOptions } from '@src/api/managers/stickers/StickersManagerEditOptions'

export class ClientStickersManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Sticker>

  constructor(client: Client) {
    super(client)

    this.cache = new EntitiesCacheManager<Sticker>(this.client, {
      keyspace: Keyspaces.STICKERS,
      storage: 'global',
      entity: 'Sticker',
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

  async fetchMany(guild: GuildResolvable): Promise<Collection<string, Sticker> | undefined> {
    const guildId = resolveGuildId(guild)

    if (!guildId) throw new DiscordooError('ClientStickersManager#fetchMany', 'Cannot fetch guild stickers without guild id.')

    const response = await this.client.internals.actions.getGuildStickers(guildId)
    const Sticker = EntitiesUtil.get('Sticker')

    if (response.success) {
      const result = new Collection()

      for await (const data of response.result) {
        const sticker = await new Sticker(this.client).init(data)
        await this.cache.set(sticker.id, sticker, { storage: guildId })
        result.set(sticker.id, sticker)
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

  async edit<R = Sticker>(
    guild: GuildResolvable,
    sticker: StickerResolvable,
    data: StickerEditData | RawStickerEditData,
    options: StickersManagerEditOptions = {}
  ): Promise<R | undefined> {
    const stickerId = resolveStickerId(sticker),
      guildId = resolveGuildId(guild)

    if (!stickerId) throw new DiscordooError('ClientStickersManager#edit', 'Cannot edit sticker without id.')
    if (!guildId) throw new DiscordooError('ClientStickersManager#edit', 'Cannot edit sticker without guild id.')

    const payload: RawStickerEditData = {
      name: data.name,
      tags: typeof data.tags === 'string' ? data.tags : (data.tags?.join(', ') ?? ''),
      description: data.description
    }

    const response = await this.client.internals.actions.editGuildSticker(guildId, stickerId, payload, options.reason)
    const Sticker = EntitiesUtil.get('Sticker')

    if (response.success) {
      if (options.patchEntity) {
        return await options.patchEntity.init(response.result) as any
      } else {
        return await new Sticker(this.client).init(response.result) as any
      }
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
