import { AbstractEvent } from '@src/events/AbstractEvent'
import { MessageData } from '@src/api/entities/message'
import { EventsNames } from '@src/constants'
import { EntitiesUtil } from '@src/api'

export class MessageCreateEvent extends AbstractEvent {
  public name = EventsNames.MESSAGE_CREATE

  async execute(data: MessageData) {
    const Message = EntitiesUtil.get('Message')

    const msg = await new Message(this.client).init(data)

    this.client.emit(EventsNames.MESSAGE_CREATE, msg)
  }
}
