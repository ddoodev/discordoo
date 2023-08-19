import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import {
  Invite,
  EntitiesCacheManager,
  EntitiesUtil,
  AnyInvitableChannelResolvable, InviteGuildsManager, InviteCreateOptions, GuildResolvable, FetchInviteData
} from '@src/api'
import { DiscordRestApplication } from '@src/core'
import { Keyspaces } from '@src/constants'
import { DiscordooError, resolveChannelId, resolveGuildId } from '@src/utils'
import { is } from 'typescript-is'

export class ApplicationInvitesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Invite>
  public guilds: InviteGuildsManager

  constructor(app: DiscordRestApplication) {
    super(app)

    this.cache = new EntitiesCacheManager<Invite>(this.app, {
      keyspace: Keyspaces.Invites,
      storage: 'global',
      entity: 'Invite',
      policy: 'invites'
    })
    this.guilds = new InviteGuildsManager(this.app)
  }

  async create(channel: AnyInvitableChannelResolvable, options: InviteCreateOptions = {}): Promise<Invite | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) throw new DiscordooError('ApplicationInvitesManager#create', 'Cannot create invite without channel id.')

    const response = await this.app.internals.actions.createInvite(channelId, {
      max_age: options.maxAge,
      max_uses: options.maxUses,
      temporary: options.temporary,
      unique: options.unique,
      target_type: options.targetType,
      target_user_id: options.targetUserId,
      target_application_id: options.targetApplicationId
    }, options.reason)

    if (response.success) {
      const Invite = EntitiesUtil.get('Invite')
      const invite = await new Invite(this.app).init(response.result)

      if (response.result.guild) {
        const InviteGuild = EntitiesUtil.get('InviteGuild')
        const inviteGuild = await new InviteGuild(this.app).init(response.result.guild)
        await this.guilds.cache.set(inviteGuild.id, inviteGuild)
      }
      await this.cache.set(invite.code, invite, { storage: invite.guildId ? invite.guildId : 'global' })

      return invite
    }
  }

  async delete(inviteCode: string, reason?: string): Promise<Invite | undefined> {
    const response = await this.app.internals.actions.deleteInvite(inviteCode, reason)

    if (response.success) {
      const Invite = EntitiesUtil.get('Invite')
      return await new Invite(this.app).init(response.result)
    }
  }

  async fetch(guild: GuildResolvable): Promise<Invite[] | undefined>
  async fetch(invite: FetchInviteData): Promise<Invite | undefined>
  async fetch(guildOrInvite: GuildResolvable | FetchInviteData): Promise<Invite[] | Invite | undefined> {
    return is<FetchInviteData>(guildOrInvite) ? this.fetchOne(guildOrInvite) : this.fetchMany(guildOrInvite)
  }

  async fetchMany(guild: GuildResolvable): Promise<Invite[] | undefined> {
    const guildId = resolveGuildId(guild)
    if (!guildId) throw new DiscordooError('ApplicationInvitesManager#fetchMany', 'Cannot fetch invites without guild id.')

    const response = await this.app.internals.actions.getGuildInvites(guildId)

    if (response.success) {
      const Invite = EntitiesUtil.get('Invite')
      const User = EntitiesUtil.get('User')

      return Promise.all(response.result.map(async invite => {
        const inviteEntity = await new Invite(this.app).init(invite)

        if (invite.inviter) {
          const user = await new User(this.app).init(invite.inviter)
          await this.app.users.cache.set(user.id, user)
        }

        if (invite.target_user) {
          const user = await new User(this.app).init(invite.target_user)
          await this.app.users.cache.set(user.id, user)
        }

        await this.cache.set(invite.code, inviteEntity, { storage: guildId })
        return inviteEntity
      }))
    }
  }

  async fetchOne(data: FetchInviteData): Promise<Invite | undefined> {
    if (!data?.code) throw new DiscordooError('ApplicationInvitesManager#fetchOne', 'Cannot fetch invite without code.')

    const response = await this.app.internals.actions.getInvite(data.code, data)

    if (response.success) {
      const Invite = EntitiesUtil.get('Invite')
      const User = EntitiesUtil.get('User')

      const invite = await new Invite(this.app).init(response.result)

      if (response.result.inviter) {
        const user = await new User(this.app).init(response.result.inviter)
        await this.app.users.cache.set(user.id, user)
      }

      if (response.result.guild) {
        const InviteGuild = EntitiesUtil.get('InviteGuild')
        const inviteGuild = await new InviteGuild(this.app).init(response.result.guild)
        await this.guilds.cache.set(inviteGuild.id, inviteGuild)
      }

      if (response.result.target_user) {
        const user = await new User(this.app).init(response.result.target_user)
        await this.app.users.cache.set(user.id, user)
      }

      await this.cache.set(invite.code, invite, { storage: invite.guildId ? invite.guildId : 'global' })
      return invite
    }
  }
}
