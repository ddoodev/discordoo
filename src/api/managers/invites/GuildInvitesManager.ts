import {
  AnyInvitableChannelResolvable,
  EntitiesCacheManager,
  FetchInviteData,
  Invite,
  InviteCreateOptions
} from '@src/api'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { DiscordRestApplication } from '@src/core'
import { Keyspaces } from '@src/constants'
import { InviteGuildsManagerData } from '@src/api/managers/invites/InviteGuildsManagerData'
import { DiscordooError, resolveChannelId, resolveGuildId } from '@src/utils'

export class GuildInvitesManager extends EntitiesManager {
  cache: EntitiesCacheManager<Invite>
  public guildId: string

  constructor(app: DiscordRestApplication, data: InviteGuildsManagerData) {
    super(app)

    const id = resolveGuildId(data.guild)
    if (!id) throw new DiscordooError('GuildChannelsManager', 'Cannot operate without guild id provided.')
    this.guildId = id

    this.cache = new EntitiesCacheManager<Invite>(this.app, {
      keyspace: Keyspaces.Invites,
      storage: this.guildId,
      entity: 'Invite',
      policy: 'invites'
    })
  }

  async fetch(): Promise<Invite[] | undefined>
  async fetch(data: FetchInviteData): Promise<Invite | undefined>
  async fetch(data?: FetchInviteData): Promise<Invite[] | Invite | undefined> {
    if (!data) return this.fetchMany()
    else return this.fetchOne(data)
  }

  async fetchMany(): Promise<Invite[] | undefined> {
    return this.app.invites.fetchMany(this.guildId)
  }

  async fetchOne(data: FetchInviteData): Promise<Invite | undefined> {
    return this.app.invites.fetchOne(data)
  }

  async create(
    channel: AnyInvitableChannelResolvable,
    options: InviteCreateOptions = {}
  ): Promise<Invite | undefined> {
    const channelId = resolveChannelId(channel)
    if (!channelId) throw new DiscordooError('GuildInvitesManager#create', 'Cannot create invite without channel id provided.')

    return this.app.invites.create(channelId, options)
  }

  async delete(inviteCode: string, reason?: string): Promise<Invite | undefined> {
    return this.app.invites.delete(inviteCode, reason)
  }
}
