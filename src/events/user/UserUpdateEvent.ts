import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventNames } from '@src/constants'
import { ClientUser, RawUserData } from '@src/api'

// disabled
export class UserUpdateEvent extends AbstractEvent {
  public name = EventNames.USER_UPDATE

  async execute(shardId: number, data: RawUserData) {
    // console.log('user update event call')

    const stored = await this.client.users.cache.get(data.id)
    const updated = stored ? await (await stored._clone()).init(data) : await new ClientUser(this.client).init(data)

    // console.log('user update event cache updating')

    await this.client.users.cache.set(data.id, updated)

    // console.log('user update event cache updated')

    // console.log('user update event emit')
    this.client.emit(EventNames.USER_UPDATE, {
      userId: data.id,
      stored,
      updated,
      shardId,
    })

  }
}