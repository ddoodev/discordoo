import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { EntitiesCacheManager, RoleResolvable, UserResolvable } from '@src/api'
import { PermissionsOverwrite } from '@src/api/entities/overwrites/PermissionsOverwrite'
import { Client } from '@src/core'
import { ChannelPermissionsOverwritesManagerData } from '@src/api/managers/overwrites/ChannelPermissionsOverwritesManagerData'
import { Keyspaces } from '@src/constants'
import { PermissionsOverwriteResolvable } from '@src/api/entities/overwrites/interfaces/PermissionsOverwriteResolvable'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { PermissionsOverwriteUpsertOptions } from '@src/api/managers/overwrites/PermissionsOverwriteUpsertOptions'
import { PermissionsOverwriteEditOptions } from '@src/api/managers/overwrites/PermissionsOverwriteEditOptions'

export class ChannelPermissionsOverwritesManager<T extends AnyGuildChannel> extends EntitiesManager {
  public cache: EntitiesCacheManager<PermissionsOverwrite>
  public channel: T

  constructor(client: Client, data: ChannelPermissionsOverwritesManagerData<T>) {
    super(client)

    this.channel = data.channel

    this.cache = new EntitiesCacheManager<PermissionsOverwrite>(this.client, {
      keyspace: Keyspaces.CHANNEL_PERMISSIONS_OVERWRITES,
      storage: this.channel.id,
      entity: 'PermissionsOverwrite',
      policy: 'overwrites'
    })
  }

  set(overwrites: PermissionsOverwriteResolvable[] | null, reason?: string): Promise<T | undefined> {
    return this.client.overwrites.set<T>(this.channel.id, overwrites, { reason, patchEntity: this.channel })
  }

  async upsert(overwrite: PermissionsOverwriteResolvable, options?: PermissionsOverwriteUpsertOptions): Promise<T | undefined> {
    const result = await this.client.overwrites.upsert(this.channel.id, overwrite, options)

    return result ? this.channel : undefined
  }

  async create(overwrite: PermissionsOverwriteResolvable, reason?: string): Promise<T | undefined> {
    const result = await this.client.overwrites.create(this.channel.id, overwrite, reason)

    return result ? this.channel : undefined
  }

  async edit(overwrite: PermissionsOverwriteResolvable, options?: PermissionsOverwriteEditOptions): Promise<T | undefined> {
    const result = await this.client.overwrites.edit(this.channel.id, overwrite, options)

    return result ? this.channel : undefined
  }

  async delete(
    userOrRoleOrOverwrite: UserResolvable | RoleResolvable | PermissionsOverwriteResolvable, reason?: string
  ): Promise<T | undefined> {
    const result = await this.client.overwrites.delete(this.channel.id, userOrRoleOrOverwrite, reason)

    return result ? this.channel : undefined
  }
}
