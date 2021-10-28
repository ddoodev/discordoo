import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { PermissionsOverwriteTypes, ToJsonOverrideSymbol } from '@src/constants'
import { ChannelResolvable, Json, ReadonlyPermissions, ToJsonProperties } from '@src/api'
import { PermissionsOverwriteResolvable } from '@src/api/entities/overwrites/interfaces/PermissionsOverwriteResolvable'
import { DiscordooError, resolveChannelId, resolvePermissionsOverwriteToRaw } from '@src/utils'
import { CacheManagerGetOptions } from '@src/cache'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { PermissionsOverwriteEditOptions } from '@src/api/managers/overwrites/PermissionsOverwriteEditOptions'

export class PermissionsOverwrite extends AbstractEntity {
  public id!: string
  public type!: PermissionsOverwriteTypes
  public allow!: ReadonlyPermissions
  public deny!: ReadonlyPermissions
  public channelId!: string

  async init(data: PermissionsOverwriteResolvable & { channel: ChannelResolvable }): Promise<this> {
    const overwrite = resolvePermissionsOverwriteToRaw(data, this)

    this.id = overwrite.id
    this.type = overwrite.type

    this.allow = new ReadonlyPermissions(overwrite.allow)
    this.deny = new ReadonlyPermissions(overwrite.deny)

    if (data.channel) {
      const id = resolveChannelId(data.channel)

      if (!id && !this.channelId) {
        throw new DiscordooError('PermissionsOverwrite', 'Cannot operate without channel id.')
      }

      if (id) this.channelId = id
    }

    return this
  }

  channel(options?: CacheManagerGetOptions): Promise<AnyGuildChannel | undefined> {
    return this.client.channels.cache.get(this.channelId, options) as Promise<AnyGuildChannel | undefined>
  }

  async edit(overwrite: PermissionsOverwriteResolvable, options?: PermissionsOverwriteEditOptions): Promise<this | undefined> {
    const result = await this.client.overwrites.upsert(this.channelId, overwrite, { ...options, existing: this })

    return result ? this : undefined
  }

  async delete(reason?: string): Promise<this | undefined> {
    const result = await this.client.overwrites.delete(this.channelId, this.id, reason)

    return result ? this : undefined
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      id: true,
      type: true,
      allow: true,
      deny: true,
      channel: {
        override: ToJsonOverrideSymbol,
        value: this.channelId
      },
    }, obj)
  }

}
