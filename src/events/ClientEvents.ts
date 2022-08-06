import { Client } from '@src/core'
import { AbstractEvent } from '@src/events/AbstractEvent'
import { Collection } from '@discordoo/collection'
import { AbstractEventContext } from '@src/events/interfaces'

export class ClientEvents {
  public client: Client
  public handlers: Collection<string, AbstractEvent<AbstractEventContext>>

  constructor(client: Client) {
    this.client = client
    this.handlers = new Collection<string, AbstractEvent<AbstractEventContext>>()
  }

  register(events: any[]) {
    events.forEach(Event => {
      const e = new Event(this.client)
      this.handlers.set(e.name, e)
    })
  }
}
