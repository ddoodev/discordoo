import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { PermissionOverwriteTypes, ToJsonOverrideSymbol } from '@src/constants'
import { ChannelResolvable, Json, ReadonlyPermissions, ToJsonProperties } from '@src/api'
import { PermissionOverwriteResolvable } from '@src/api/entities/overwrite/interfaces/PermissionOverwriteResolvable'
import { DiscordooError, resolveChannelId, resolvePermissionOverwriteToRaw } from '@src/utils'
import { CacheManagerGetOptions } from '@src/cache'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { PermissionOverwriteEditOptions } from '@src/api/managers/overwrites/PermissionOverwriteEditOptions'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class PermissionOverwrite extends AbstractEntity {
  public declare id: string
  public declare type: PermissionOverwriteTypes
  public declare allow: ReadonlyPermissions
  public declare deny: ReadonlyPermissions
  public declare channelId: string

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async init(data: PermissionOverwriteResolvable & { channel: ChannelResolvable }, options?: EntityInitOptions): Promise<this> {
    // options declared for the future
    const overwrite = resolvePermissionOverwriteToRaw(data, this.allow && this.deny ? this : undefined)

    this.id = overwrite.id
    this.type = overwrite.type

    this.allow = new ReadonlyPermissions(overwrite.allow)
    this.deny = new ReadonlyPermissions(overwrite.deny)

    if ('channelId' in data) {
      this.channelId = data.channelId
    } else if (data.channel) {
      const id = resolveChannelId(data.channel)

      if (!id && !this.channelId) {
        throw new DiscordooError('PermissionOverwrite', 'Cannot operate without channel id.')
      }

      if (id) this.channelId = id
    }

    return this
  }

  channel(options?: CacheManagerGetOptions): Promise<AnyGuildChannel | undefined> {
    return this.client.channels.cache.get(this.channelId, options) as Promise<AnyGuildChannel | undefined>
  }

  async edit(overwrite: PermissionOverwriteResolvable, options?: PermissionOverwriteEditOptions): Promise<this | undefined> {
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
