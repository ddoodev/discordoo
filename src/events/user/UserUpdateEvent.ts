import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventNames } from '@src/constants'
import { RawUserData } from '@src/api'
import { UserUpdateEventContext } from '@src/events'

export class UserUpdateEvent extends AbstractEvent<UserUpdateEventContext> {
  public name = EventNames.USER_UPDATE

  async execute(shardId: number, data: RawUserData) {
    const stored = this.app.user
    const updated = await (await stored._clone()).init(data)

    await this.app.users.cache.set(data.id, updated)

    const context: UserUpdateEventContext = {
      userId: data.id,
      stored,
      updated,
      shardId,
    }

    this.app.emit(EventNames.USER_UPDATE, context)
    return context
  }
}