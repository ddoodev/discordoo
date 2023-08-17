import { AnyInvitableChannelResolvable, EntitiesCacheManager, EntitiesUtil, Invite, InviteCreateOptions } from '@src/api'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { DiscordRestApplication } from '@src/core'
import { Keyspaces } from '@src/constants'
import { InviteGuildsManagerData } from '@src/api/managers/invites/InviteGuildsManagerData'
import { DiscordooError, resolveChannelId, resolveGuildId } from '@src/utils'

export class InviteGuildsManager extends EntitiesManager {
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

  async create(
    channel: AnyInvitableChannelResolvable,
    options: InviteCreateOptions = {}
  ): Promise<Invite | undefined> {
    const channelId = resolveChannelId(channel)

    if (!channelId) throw new DiscordooError('InviteGuildsManager#create', 'Cannot create invite without channel id.')

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

      await this.cache.set(invite.code, invite)

      return invite
    }
  }

  async delete(inviteCode: string, reason?: string): Promise<boolean> {
    const response = await this.app.internals.actions.deleteInvite(inviteCode, reason)

    if (response.success) {
      await this.cache.delete(inviteCode)
    }

    return response.success
  }
}
