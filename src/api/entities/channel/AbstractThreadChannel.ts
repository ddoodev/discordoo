import { AbstractChannel } from '@src/api/entities/channel/AbstractChannel'
import { AbstractThreadChannelData } from '@src/api/entities/channel/interfaces/AbstractThreadChannelData'
import { RawAbstractThreadChannelData } from '@src/api/entities/channel/interfaces/RawAbstractThreadChannelData'
import {
  ChannelMessagesManager,
  GuildMember,
  Json,
  PermissionsCheckOptions,
  ReadonlyPermissions,
  RoleResolvable,
  ToJsonProperties,
  User
} from '@src/api'
import { ThreadMetadata } from '@src/api/entities/channel/interfaces/ThreadMetadata'
import { attach } from '@src/utils'
import { WritableChannel } from '@src/api/entities/channel/interfaces/WritableChannel'
import { is } from 'typescript-is'
import { ThreadChannelEditData } from '@src/api/entities/channel/interfaces/ThreadChannelEditData'
import { RawThreadChannelEditData } from '@src/api/entities/channel/interfaces/RawThreadChannelEditData'
import { CacheManagerGetOptions } from '@src/cache'
import { Keyspaces } from '@src/constants'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { GuildMemberResolvable } from '@src/api/entities/member/interfaces/GuildMemberResolvable'
import { ThreadMembersManager } from '@src/api/managers/members/ThreadMembersManager'
import { ThreadMember } from '@src/api/entities/member/ThreadMember'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export abstract class AbstractThreadChannel extends AbstractChannel implements AbstractThreadChannelData, WritableChannel {
  public declare messages: ChannelMessagesManager
  public declare members: ThreadMembersManager
  public declare guildId: string
  public lastMessageId?: string
  public lastPinTimestamp?: number
  public memberCount?: number
  public messageCount?: number
  public ownerId?: string
  public parentId?: string
  public rateLimitPerUser?: number
  public metadata?: ThreadMetadata

  async init(data: AbstractThreadChannelData | RawAbstractThreadChannelData, options?: EntityInitOptions): Promise<this> {
    await super.init(data, options)

    attach(this, data, {
      props: [
        [ 'guildId', 'guild_id' ],
        [ 'parentId', 'parent_id' ],
        [ 'ownerId', 'owner_id' ],
        [ 'lastMessageId', 'last_message_id' ],
        [ 'lastPinTimestamp', 'last_pin_timestamp' ],
        [ 'rateLimitPerUser', 'rate_limit_per_user' ],
        [ 'messageCount', 'message_count' ],
        [ 'memberCount', 'member_count' ],
      ],
      disabled: options?.ignore,
      enabled: [ 'guildId' ]
    })

    if (typeof this.lastPinTimestamp === 'string'!) { // discord sends timestamp in string
      this.lastPinTimestamp = new Date(this.lastPinTimestamp!).getTime()

      if (this.messages) {
        this.messages.pinned.lastPinTimestamp = this.lastPinTimestamp
      }
    }

    if ('thread_metadata' in data && data.thread_metadata) {
      const { archived, archive_timestamp, auto_archive_duration, locked, invitable } = data.thread_metadata
      this.metadata = {
        archived,
        archiveTimestamp: new Date(archive_timestamp).getTime(),
        autoArchiveDuration: auto_archive_duration,
        locked,
        invitable
      }
    } else if ('metadata' in data && data.metadata) {
      if (is<ThreadMetadata>(data.metadata)) this.metadata = data.metadata
    }

    if (!this.messages) {
      this.messages = new ChannelMessagesManager(this.client, {
        channel: this.id,
        lastMessageId: this.lastMessageId,
        lastPinTimestamp: this.lastPinTimestamp,
      })
    }

    if (this.lastMessageId) {
      this.messages.lastMessageId = this.lastMessageId
    }

    if (!this.members) {
      this.members = new ThreadMembersManager(this.client, {
        thread: this.id,
        guild: this.guildId,
      })
    }

    return this
  }

  set lastMsgId(id: string) {
    this.lastMessageId = id
    this.messages.lastMessageId = id
  }

  get lastPinDate(): Date | undefined {
    return this.lastPinTimestamp ? new Date(this.lastPinTimestamp) : undefined
  }

  get archivedDate(): Date | undefined {
    return this.metadata ? new Date(this.metadata.archiveTimestamp) : undefined
  }

  async join(): Promise<this | undefined> {
    const result = await this.members.add('@me')
    return result ? this : undefined
  }

  async leave(): Promise<this | undefined> {
    const result = await this.members.remove('@me')
    return result ? this : undefined
  }

  edit(data: ThreadChannelEditData | RawThreadChannelEditData, reason?: string): Promise<this | undefined> {
    return this.client.channels.editThreadChannel(this.id, data, { reason, patchEntity: this })
  }

  setArchived(archived: boolean, reason?: string) {
    return this.edit({ archived }, reason)
  }

  setAutoArchiveDuration(autoArchiveDuration: number, reason?: string) {
    return this.edit({ autoArchiveDuration }, reason)
  }

  setInvitable(invitable: boolean, reason?: string) {
    return this.edit({ invitable }, reason)
  }

  setName(name: string, reason?: string) {
    return this.edit({ name }, reason)
  }

  setRateLimitPerUser(rateLimitPerUser: number, reason?: string) {
    return this.edit({ rateLimitPerUser }, reason)
  }

  get send() {
    return this.messages.create.bind(this.messages)
  }

  guild(options?: CacheManagerGetOptions): Promise<any | undefined> { // TODO: Guild
    return this.client.guilds.cache.get(this.guildId, options)
  }

  async owner(options?: CacheManagerGetOptions): Promise<User | undefined> {
    return this.ownerId ? this.client.users.cache.get(this.ownerId, options) : undefined
  }

  async ownerGuildMember(options?: CacheManagerGetOptions): Promise<GuildMember | undefined> {
    if (!this.ownerId) return undefined

    return this.client.internals.cache.get(
      Keyspaces.GUILD_MEMBERS,
      this.guildId,
      'GuildMember',
      this.ownerId,
      options
    )
  }

  async ownerThreadMember(options?: CacheManagerGetOptions): Promise<ThreadMember | undefined> {
    if (!this.ownerId) return undefined
    return this.members.cache.get(this.ownerId, options)
  }

  async parent(options?: CacheManagerGetOptions): Promise<AnyGuildChannel | undefined> {
    if (!this.parentId) return undefined

    return this.client.internals.cache.get(
      Keyspaces.CHANNELS,
      this.guildId,
      'channelEntityKey',
      this.parentId,
      options
    )
  }

  async memberPermissions(member: GuildMemberResolvable, options?: PermissionsCheckOptions): Promise<ReadonlyPermissions | undefined> {
    const parent = await this.parent()
    return parent?.memberPermissions(member, options)
  }

  async rolePermissions(role: RoleResolvable, options?: PermissionsCheckOptions): Promise<ReadonlyPermissions | undefined> {
    const parent = await this.parent()
    return parent?.rolePermissions(role, options)
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      guildId: true,
      lastMessageId: true,
      lastPinTimestamp: true,
      memberCount: true,
      messageCount: true,
      ownerId: true,
      parentId: true,
      rateLimitPerUser: true,
      metadata: true,
    }, obj)
  }

}
