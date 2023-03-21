import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { EntitiesCacheManager, RoleResolvable, UserResolvable } from '@src/api'
import { PermissionOverwrite } from '@src/api/entities/overwrite/PermissionOverwrite'
import { DiscordApplication } from '@src/core'
import { ChannelPermissionOverwritesManagerData } from '@src/api/managers/overwrites/ChannelPermissionOverwritesManagerData'
import { Keyspaces } from '@src/constants'
import { PermissionOverwriteResolvable } from '@src/api/entities/overwrite/interfaces/PermissionOverwriteResolvable'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { PermissionOverwriteUpsertOptions } from '@src/api/managers/overwrites/PermissionOverwriteUpsertOptions'
import { PermissionOverwriteEditOptions } from '@src/api/managers/overwrites/PermissionOverwriteEditOptions'
import { RestEligibleDiscordApplication } from '@src/core/apps/AnyDiscordApplication'

export class ChannelPermissionOverwritesManager<T extends AnyGuildChannel> extends EntitiesManager {
  public cache: EntitiesCacheManager<PermissionOverwrite>
  public channel: T

  constructor(app: RestEligibleDiscordApplication, data: ChannelPermissionOverwritesManagerData<T>) {
    super(app)

    this.channel = data.channel

    this.cache = new EntitiesCacheManager<PermissionOverwrite>(this.app, {
      keyspace: Keyspaces.ChannelPermissionsOverwrites,
      storage: this.channel.id,
      entity: 'PermissionOverwrite',
      policy: 'overwrites'
    })
  }

  set(overwrites: PermissionOverwriteResolvable[] | null, reason?: string): Promise<T | undefined> {
    return this.app.overwrites.set<T>(this.channel.id, overwrites, { reason, patchEntity: this.channel })
  }

  async upsert(overwrite: PermissionOverwriteResolvable, options?: PermissionOverwriteUpsertOptions): Promise<T | undefined> {
    const result = await this.app.overwrites.upsert(this.channel.id, overwrite, options)

    return result ? this.channel : undefined
  }

  async create(overwrite: PermissionOverwriteResolvable, reason?: string): Promise<T | undefined> {
    const result = await this.app.overwrites.create(this.channel.id, overwrite, reason)

    return result ? this.channel : undefined
  }

  async edit(overwrite: PermissionOverwriteResolvable, options?: PermissionOverwriteEditOptions): Promise<T | undefined> {
    const result = await this.app.overwrites.edit(this.channel.id, overwrite, options)

    return result ? this.channel : undefined
  }

  async delete(
    userOrRoleOrOverwrite: UserResolvable | RoleResolvable | PermissionOverwriteResolvable, reason?: string
  ): Promise<T | undefined> {
    const result = await this.app.overwrites.delete(this.channel.id, userOrRoleOrOverwrite, reason)

    return result ? this.channel : undefined
  }
}
