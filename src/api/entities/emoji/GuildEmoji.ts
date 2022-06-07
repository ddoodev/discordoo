import { AbstractEmoji } from '@src/api/entities/emoji/AbstractEmoji'
import { AbstractGuildEmoji } from '@src/api/entities/emoji/interfaces/AbstractGuildEmoji'
import { GuildEmojiData } from '@src/api/entities/emoji/interfaces/GuildEmojiData'
import { User } from '@src/api/entities/user'
import { resolveRoleId, resolveUserId } from '@src/utils/resolve'
import { DiscordooError, attach } from '@src/utils'
import { RawGuildEmojiData } from '@src/api/entities/emoji/interfaces/RawGuildEmojiData'
import { GuildEmojiEditData } from '@src/api/entities/emoji/interfaces/GuildEmojiEditData'
import { RoleResolvable } from '@src/api/entities/role'
import { ToJsonProperties } from '@src/api/entities/interfaces/ToJsonProperties'
import { Json } from '@src/api/entities/interfaces/Json'
import { EntitiesUtil } from '@src/api/entities/EntitiesUtil'
import { CacheManagerGetOptions } from '@src/cache'
import { filterAndMap } from '@src/utils/filterAndMap'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class GuildEmoji extends AbstractEmoji implements AbstractGuildEmoji {
  public declare id: string
  public declare name: string
  public declare available: boolean
  public declare guildId: string
  public declare managed: boolean
  public declare requiresColons: boolean
  public roles: string[] = []
  public userId?: string

  async init(data: GuildEmojiData | RawGuildEmojiData, options?: EntityInitOptions): Promise<this> {
    await super.init(data, options)

    if (data.user) {
      // @ts-ignore
      data.user_id = resolveUserId(data.user)
    }

    attach(this, data, {
      props: [
        [ 'available', undefined, false ],
        [ 'managed', undefined, false ],
        [ 'requiresColons', 'requires_colons', false ],
        [ 'guildId', 'guild_id' ],
        [ 'userId', 'user_id' ],
      ],
      disabled: options?.ignore,
      enabled: [ 'managed', 'guildId', 'available' ]
    })

    if (data.roles) {
      this.roles = []

      for (const role of data.roles) {
        const id = resolveRoleId(role)
        if (id) this.roles.push(id)
      }
    }

    return this
  }

  guild(options?: CacheManagerGetOptions): Promise<any | undefined> { // TODO: Guild
    return this.client.guilds.cache.get(this.guildId, options)
  }

  async user(options?: CacheManagerGetOptions): Promise<User | undefined> {
    return this.userId !== undefined ? this.client.users.cache.get(this.userId, options) : undefined
  }

  async fetchUser(): Promise<User | undefined> {
    if (this.managed) return undefined
    if (!this.id) return undefined

    const response = await this.client.internals.actions.getGuildEmoji(this.guildId, this.id)

    const User = EntitiesUtil.get('User')

    if (response.success) {
      await this.init(response.result)
      return new User(this.client).init(response.result.user)
    }

    return undefined
  }

  async edit(data: GuildEmojiEditData, reason?: string): Promise<this> {
    if (!this.guildId && !data.guildId) throw new DiscordooError('Emoji', 'Cannot edit emoji without guild id')
    if (!this.id && !data.id) throw new DiscordooError('Emoji', 'Cannot edit emoji without id')
    if (this.name === undefined) throw new DiscordooError('Emoji', 'Cannot edit emoji without name')

    const roles = filterAndMap<RoleResolvable, string>(
      data.roles ?? [],
      (r) => resolveRoleId(r) !== undefined,
      (r) => resolveRoleId(r)
    )

    const response = await this.client.internals.actions.editGuildEmoji(
      (this.guildId ?? data.guildId)!,
      (this.id ?? data.id)!,
      {
        roles,
        name: data.name ?? this.name
      },
      reason
    )

    if (response.success) {
      await this.init(response.result)
    }

    return this
  }

  setName(name: string, reason?: string): Promise<this> {
    return this.edit({ name }, reason)
  }

  setRoles(roles: RoleResolvable[], reason?: string): Promise<this> {
    return this.edit({ roles }, reason)
  }

  async delete(reason?: string): Promise<this | undefined> {
    if (!this.guildId) throw new DiscordooError('Emoji', 'Cannot delete emoji without guild id')
    if (!this.id) throw new DiscordooError('Emoji', 'Cannot delete emoji without id')

    const response = await this.client.internals.actions.deleteGuildEmoji(this.guildId, this.id, reason)

    return response.success ? this : undefined
  }

  equals(
    emoji: GuildEmoji | RawGuildEmojiData
  ): boolean {
    return !!(this.name === emoji.name
      && this.available === emoji.available
      && this.roles?.every(r => emoji.roles?.indexOf(r) || -1 > -1)
      && emoji.roles?.every(r => this.roles?.indexOf(r) || -1 > -1))
  }

  toJson(properties: ToJsonProperties, obj?: any): Json {
    return super.toJson({
      ...properties,
      available: true,
      guildId: true,
      managed: true,
      requiresColons: true,
      roles: true,
      userId: true,
    }, obj)
  }

}
