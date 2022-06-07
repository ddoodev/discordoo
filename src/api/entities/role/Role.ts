import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { RoleData } from '@src/api/entities/role/interfaces/RoleData'
import { ColorResolvable, GuildMember, Json, PermissionsResolvable, ReadonlyPermissions, ToJsonProperties } from '@src/api'
import { RoleTagsData } from '@src/api/entities/role/interfaces/RoleTagsData'
import { RawRoleData } from '@src/api/entities/role/interfaces/RawRoleData'
import { idToDate, idToTimestamp, ImageUrlOptions, attach } from '@src/utils'
import { resolveRoleTags } from '@src/utils/resolve'
import { CacheManagerFilterOptions, CacheManagerGetOptions } from '@src/cache'
import { Keyspaces } from '@src/constants'
import { RoleEditData } from '@src/api/entities/role/interfaces/RoleEditData'
import { Base64Resolvable } from '@src/utils/interfaces/Base64Resolvable'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class Role extends AbstractEntity { // TODO: positions...
  public declare color: number
  public declare hoist: boolean
  public icon?: string
  public declare id: string
  public declare managed: boolean
  public declare mentionable: boolean
  public declare name: string
  public declare permissions: ReadonlyPermissions
  public declare rawPosition: number
  public tags?: RoleTagsData
  public unicodeEmoji?: string
  public declare guildId: string
  public deleted = false

  async init(data: RawRoleData | RoleData, options?: EntityInitOptions): Promise<this> {

    data.permissions = new ReadonlyPermissions(data.permissions)

    if (data.tags) {
      data.tags = resolveRoleTags(data.tags)
    }

    attach(this, data, {
      props: [
        'color',
        'hoist',
        'icon',
        'id',
        'managed',
        'mentionable',
        'name',
        [ 'rawPosition', 'position', 0 ],
        [ 'unicodeEmoji', 'unicode_emoji' ],
        [ 'guildId', 'guild_id' ],
        'deleted',
        'permissions',
        'tags'
      ],
      disabled: options?.ignore,
      enabled: [ 'id', 'guildId', 'deleted', 'color', 'managed' ]
    })

    return this
  }

  async members(options?: CacheManagerFilterOptions): Promise<Array<[ string, GuildMember ]>> {
    return this.client.internals.cache.filter<string, GuildMember>(
      Keyspaces.GUILD_MEMBERS,
      this.guildId,
      'GuildMember',
      (member) => member.rolesList.includes(this.id), // TODO: context
      options
    )
  }

  guild(options?: CacheManagerGetOptions): Promise<any> { // TODO: Guild
    return this.client.guilds.cache.get(this.guildId, options)
  }

  async delete(reason?: string): Promise<this | undefined> {
    const response = await this.client.roles.delete(this.guildId, this.id, reason)

    if (response) {
      this.deleted = true
      return this
    }

    return undefined
  }

  edit(data: RoleEditData, reason?: string): Promise<this | undefined> {
    return this.client.roles.edit<this>(this.guildId, this.id, data, { reason, patchEntity: this })
  }

  setName(name: string, reason?: string) {
    return this.edit({ name }, reason)
  }

  setColor(color: ColorResolvable, reason?: string) {
    return this.edit({ color }, reason)
  }

  setHoist(hoist: boolean, reason?: string) {
    return this.edit({ hoist }, reason)
  }

  setPermissions(permissions: PermissionsResolvable, reason?: string) {
    return this.edit({ permissions }, reason)
  }

  setMentionable(mentionable: boolean, reason?: string) {
    return this.edit({ mentionable }, reason)
  }

  setIcon(icon: Base64Resolvable, reason?: string) {
    return this.edit({ icon }, reason)
  }

  setUnicodeEmoji(unicodeEmoji: string, reason?: string) {
    return this.edit({ unicodeEmoji }, reason)
  }

  get createdTimestamp(): number {
    return idToTimestamp(this.id)
  }

  get createdDate(): Date {
    return idToDate(this.id)
  }

  get hexColor() {
    return `#${this.color.toString(16).padStart(6, '0')}`
  }

  iconUrl(options?: ImageUrlOptions): string | undefined {
    return this.icon ? this.client.internals.rest.cdn.roleIcon(this.id, this.icon, options) : undefined
  }

  toString(): string {
    if (this.id === this.guildId) return '@everyone'
    return `<@&${this.id}>`
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      color: true,
      hoist: true,
      icon: true,
      id: true,
      managed: true,
      mentionable: true,
      name: true,
      permissions: true,
      rawPosition: true,
      tags: true,
      unicodeEmoji: true,
      guildId: true,
      deleted: true,
    }, obj)
  }
}
