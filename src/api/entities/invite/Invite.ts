import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'
import { attach, resolveGuildId, resolveUserId } from '@src/utils'
import { InviteData, RawInviteData } from '@src/api/entities/invite/interfaces'
import { InviteTargetTypes } from '@src/constants'
import { AnyInvitableChannel, InviteChannel, InviteGuild, Json, ToJsonProperties, User } from '@src/api'
import { CacheManagerGetOptions } from '@src/cache'

export class Invite extends AbstractEntity {
  public declare code: string
  private _channel?: InviteChannel
  public channelId?: string
  public expiresTimestamp?: number
  public guildId?: string
  public guildScheduledEvent?: any
  public inviterId?: string
  public membersCount?: number
  public presenceCount?: number
  public targetApplication?: any
  public targetType?: InviteTargetTypes
  public targetUserId?: string

  // invites metadata
  public uses?: number
  public maxUses?: number
  public maxAge?: number
  public temporary?: boolean
  public createdTimestamp?: number

  async init(data: InviteData | RawInviteData, options?: EntityInitOptions): Promise<this> {
    attach(this, data, {
      props: [
        'code',
        'uses',
        'temporary',
        [ 'targetType', 'target_type' ],
        [ 'presenceCount', 'approximate_presence_count' ],
        [ 'membersCount', 'approximate_member_count' ],
        [ 'expiresTimestamp', 'expires_at' ],
        [ 'guildScheduledEvent', 'guild_scheduled_event' ],
        [ 'targetApplication', 'target_application' ],
        [ 'maxUses', 'max_uses' ],
        [ 'maxAge', 'max_age' ],
        [ 'createdTimestamp', 'created_at' ]
      ],
      disabled: options?.ignore,
      enabled: [ 'code' ]
    })

    if (data.channel) {
      this._channel = await new InviteChannel(this.app).init(data.channel)
      this.channelId = this._channel.id
    }

    if ('channelId' in data) {
      this.channelId = data.channelId
    }

    if (data.guild) {
      this.guildId = resolveGuildId(data.guild)
    }

    if (data.inviter) {
      this.inviterId = resolveUserId(data.inviter)
    }

    if ('target_user' in data && data.target_user) {
      this.targetUserId = resolveUserId(data.target_user)
    } else if ('targetUser' in data && data.targetUser) {
      this.targetUserId = resolveUserId(data.targetUser)
    }

    if ('expires_at' in data && data.expires_at) {
      this.expiresTimestamp = new Date(data.expires_at).getTime()
    } else if ('expiresTimestamp' in data && data.expiresTimestamp) {
      this.expiresTimestamp = new Date(data.expiresTimestamp).getTime()
    }

    if ('created_at' in data && data.created_at) {
      this.createdTimestamp = new Date(data.created_at).getTime()
    } else if ('createdTimestamp' in data && data.createdTimestamp) {
      this.createdTimestamp = new Date(data.createdTimestamp).getTime()
    }

    return this
  }

  get expiresDate(): Date | undefined {
    return this.expiresTimestamp ? new Date(this.expiresTimestamp) : undefined
  }

  get createdDate(): Date | undefined {
    return this.createdTimestamp ? new Date(this.createdTimestamp) : undefined
  }

  get maxAgeDate(): Date | undefined {
    return this.maxAge ? new Date(this.maxAge) : undefined
  }

  async inviter(options?: CacheManagerGetOptions): Promise<User | undefined> {
    return this.inviterId ? await this.app.users.cache.get(this.inviterId, options) : undefined
  }

  async targetUser(options?: CacheManagerGetOptions): Promise<User | undefined> {
    return this.targetUserId ? await this.app.users.cache.get(this.targetUserId, options) : undefined
  }

  async guild(options?: CacheManagerGetOptions): Promise<InviteGuild | undefined> {
    return this.guildId ? await this.app.invites.guilds.cache.get(this.guildId, options) : undefined
  }

  async channel(): Promise<AnyInvitableChannel | InviteChannel | undefined> {
    return this._channel ? this._channel : this.channelId ? this.app.channels.cache.get<AnyInvitableChannel>(this.channelId) : undefined
  }

  toString(): string {
    const options = this.app.internals.rest.options
    return `${options.api.scheme}://${options.invites.domain}${options.invites.path}${this.code}`
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      _channel: true,
      channelId: true,
      createdTimestamp: true,
      code: true,
      expiresTimestamp: true,
      guildId: true,
      guildScheduledEvent: true,
      inviterId: true,
      membersCount: true,
      presenceCount: true,
      targetApplication: true,
      targetType: true,
      targetUserId: true,
      uses: true,
      maxUses: true,
      maxAge: true,
      temporary: true,
    }, obj)
  }
}
