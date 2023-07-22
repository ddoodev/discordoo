import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import {
  Invite,
  EntitiesCacheManager,
  FetchInviteQuery,
  EntitiesUtil,
  AnyInvitableChannelResolvable, GuildInvitesManager, InviteCreateOptions
} from '@src/api'
import { DiscordRestApplication } from '@src/core'
import { Keyspaces } from '@src/constants'
import { DiscordooError, resolveChannelId } from '@src/utils'

export class ApplicationInvitesManager extends EntitiesManager {
  public cache: EntitiesCacheManager<Invite>
  public guilds: GuildInvitesManager

  constructor(app: DiscordRestApplication) {
    super(app)

    this.cache = new EntitiesCacheManager<Invite>(this.app, {
      keyspace: Keyspaces.Invites,
      storage: 'global',
      entity: 'Invite',
      policy: 'invites'
    })
    this.guilds = new GuildInvitesManager(this.app)
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

  async fetch(inviteCode: string, options?: FetchInviteQuery): Promise<Invite | undefined> {
    const response = await this.app.internals.actions.getInvite(inviteCode, options)

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
