import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventsNames } from '@src/constants'
import { EntitiesUtil } from '@src/api'
import { RawMessageData } from '@src/api/entities/message/interfaces/RawMessageData'

export class MessageCreateEvent extends AbstractEvent {
  public name = EventsNames.MESSAGE_CREATE

  async execute(data: RawMessageData) {
    const Message = EntitiesUtil.get('Message')

    const msg = await new Message(this.client).init(data)

    this.client.emit(EventsNames.MESSAGE_CREATE, msg)
  }
}
