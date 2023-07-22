import { EntitiesManager } from '../../../../src/api/managers/EntitiesManager'
import { DiscordRestApplication } from '../../../../src/core'
import { DirectMessagesChannel, EntitiesCacheManager, EntitiesUtil, UserResolvable } from '../../../../src/api'
import { Keyspaces } from '../../../../src/constants'
import { DiscordooError, resolveUserId } from '../../../../src/utils'
import { makeCachePointer } from '../../../../src/utils/cachePointer'

export class ApplicationDirectMessagesChannelsManager extends EntitiesManager {
  public cache: EntitiesCacheManager<DirectMessagesChannel>

  constructor(app: DiscordRestApplication) {
    super(app)

    this.cache = new EntitiesCacheManager<DirectMessagesChannel>(this.app, {
      keyspace: Keyspaces.DmChannels,
      storage: 'global',
      entity: 'DirectMessagesChannel',
      policy: 'channels'
    })
  }

  async fetch(user: UserResolvable): Promise<DirectMessagesChannel | undefined> {
    const userId = resolveUserId(user)

    if (!userId) throw new DiscordooError('UsersManager#createDM', 'Cannot create/fetch Dm without user id.')

    const response = await this.app.internals.actions.createUserChannel(userId)
    const DirectMessageChannel = EntitiesUtil.get('DirectMessagesChannel')

    if (response.success) {
      const channel = await new DirectMessageChannel(this.app).init(response.result)
      await this.app.channels.cache.set(channel.id, channel, { storage: 'dm' })
      await this.cache.set(userId, makeCachePointer(Keyspaces.Channels, 'dm', channel.id))
      return channel
    }

    return undefined
  }

  /**
   * Deletes Dm channel attached to the user.
   * You can delete it only if it cached.
   * If you want to delete uncached channel, use app.channels.delete(channelId *not userId*) instead.
   * */
  async delete(user: UserResolvable): Promise<boolean> {
    const userId = resolveUserId(user)

    if (!userId) throw new DiscordooError('UsersManager#deleteDM', 'Cannot delete Dm without user id.')

    const channel = await this.cache.get(userId)
    if (channel) {
      return this.app.channels.cache.delete(channel.id)
    }

    return false
  }
}