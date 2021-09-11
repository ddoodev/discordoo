import { AbstractEvent } from '@src/events/AbstractEvent'
import { MessageData } from '@src/api/entities/message'
import { Message } from '@src/api/entities/message/Message'
import { EventsNames } from '@src/constants'

export class MessageCreateEvent extends AbstractEvent {
  public name = EventsNames.MESSAGE_CREATE

  async execute(data: MessageData) {
    const msg = await new Message(this.client).init(data)

    this.client.emit(EventsNames.MESSAGE_CREATE, msg)
  }
}
