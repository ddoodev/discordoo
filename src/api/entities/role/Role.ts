import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { RoleData } from '@src/api/entities/role/interfaces/RoleData'
import { GuildMember, Json, ReadonlyPermissions, ToJsonProperties } from '@src/api'
import { RoleTagsData } from '@src/api/entities/role/interfaces/RoleTagsData'
import { RawRoleData } from '@src/api/entities/role/interfaces/RawRoleData'
import { idToDate, idToTimestamp, ImageUrlOptions, mergeNewOrSave } from '@src/utils'
import { resolveRoleTags } from '@src/utils/resolve'
import { CacheManagerFilterOptions } from '@src/cache'
import { Keyspaces } from '@src/constants'

export class Role extends AbstractEntity {
  public color!: number
  public hoist!: boolean
  public icon?: string
  public id!: string
  public managed!: boolean
  public mentionable!: boolean
  public name!: string
  public permissions!: ReadonlyPermissions
  public rawPosition!: number
  public tags?: RoleTagsData
  public unicodeEmoji?: string
  public guildId!: string

  async init(data: RawRoleData | RoleData): Promise<this> {
    mergeNewOrSave(this, data, [
      'color',
      'hoist',
      'icon',
      'id',
      'managed',
      'mentionable',
      'name',
      [ 'rawPosition', 'position', 0 ],
      [ 'unicodeEmoji', 'unicode_emoji' ],
      [ 'guildId', 'guild_id' ]
    ])

    if ('permissions' in data) {
      this.permissions = new ReadonlyPermissions(data.permissions)
    } else if (!this.permissions) {
      this.permissions = new ReadonlyPermissions()
    }

    if (data.tags) {
      this.tags = resolveRoleTags(data.tags)
    }

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
    return this.icon ? this.client.internals.rest.cdn().roleIcon(this.id, this.icon, options) : undefined
  }

  toString(): string {
    if (this.id === this.guildId) return '@everyone'
    return `<@&${this.id}>`
  }

  toJson(properties: ToJsonProperties, obj?: any): Json {
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
    }, obj)
  }
}
