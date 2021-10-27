import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import { AbstractGuildChannelData } from '@src/api/entities/channel/interfaces/AbstractGuildChannelData'
import { RawAbstractGuildChannelData } from '@src/api/entities/channel/interfaces/RawAbstractGuildChannelData'
import { attach } from '@src/utils'

export abstract class AbstractGuildChannel extends AbstractChannel implements AbstractGuildChannelData {
  public guildId!: string
  public name!: string
  public parentId!: string
  public position!: number

  async init(data: AbstractGuildChannelData | RawAbstractGuildChannelData): Promise<this> {
    await super.init(data)

    attach(this, data, [
      'name',
      [ 'guildId', 'guild_id' ],
      [ 'parentId', 'parent_id' ],
      [ 'rawPosition', 'position' ]
    ])

    return this
  }

  /* TODO
  async members(): Promise<GuildMember[]> {

    const predicate = (member: GuildMember) => member.permissions.has(PermissionFlags.VIEW_CHANNEL)

    return this.client.internals.cache.filter('members', this.id, 'GuildMember', predicate)
      .then(results => results.map(r => r[1])) // FIXME: low performance
  }
  */



}
