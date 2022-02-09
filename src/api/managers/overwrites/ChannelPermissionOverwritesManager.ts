import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { EntitiesCacheManager, RoleResolvable, UserResolvable } from '@src/api'
import { PermissionOverwrite } from '@src/api/entities/overwrite/PermissionOverwrite'
import { Client } from '@src/core'
import { ChannelPermissionOverwritesManagerData } from '@src/api/managers/overwrites/ChannelPermissionOverwritesManagerData'
import { Keyspaces } from '@src/constants'
import { PermissionOverwriteResolvable } from '@src/api/entities/overwrite/interfaces/PermissionOverwriteResolvable'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { PermissionOverwriteUpsertOptions } from '@src/api/managers/overwrites/PermissionOverwriteUpsertOptions'
import { PermissionOverwriteEditOptions } from '@src/api/managers/overwrites/PermissionOverwriteEditOptions'

export class ChannelPermissionOverwritesManager<T extends AnyGuildChannel> extends EntitiesManager {
  public cache: EntitiesCacheManager<PermissionOverwrite>
  public channel: T

  constructor(client: Client, data: ChannelPermissionOverwritesManagerData<T>) {
    super(client)

    this.channel = data.channel

    this.cache = new EntitiesCacheManager<PermissionOverwrite>(this.client, {
      keyspace: Keyspaces.CHANNEL_PERMISSIONS_OVERWRITES,
      storage: this.channel.id,
      entity: 'PermissionOverwrite',
      policy: 'overwrites'
    })
  }

  set(overwrites: PermissionOverwriteResolvable[] | null, reason?: string): Promise<T | undefined> {
    return this.client.overwrites.set<T>(this.channel.id, overwrites, { reason, patchEntity: this.channel })
  }

  async upsert(overwrite: PermissionOverwriteResolvable, options?: PermissionOverwriteUpsertOptions): Promise<T | undefined> {
    const result = await this.client.overwrites.upsert(this.channel.id, overwrite, options)

    return result ? this.channel : undefined
  }

  async create(overwrite: PermissionOverwriteResolvable, reason?: string): Promise<T | undefined> {
    const result = await this.client.overwrites.create(this.channel.id, overwrite, reason)

    return result ? this.channel : undefined
  }

  async edit(overwrite: PermissionOverwriteResolvable, options?: PermissionOverwriteEditOptions): Promise<T | undefined> {
    const result = await this.client.overwrites.edit(this.channel.id, overwrite, options)

    return result ? this.channel : undefined
  }

  async delete(
    userOrRoleOrOverwrite: UserResolvable | RoleResolvable | PermissionOverwriteResolvable, reason?: string
  ): Promise<T | undefined> {
    const result = await this.client.overwrites.delete(this.channel.id, userOrRoleOrOverwrite, reason)

    return result ? this.channel : undefined
  }
}
