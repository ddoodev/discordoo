import { Client } from '@src/core'
import { AbstractEvent } from '@src/events/AbstractEvent'
import { Collection } from '@discordoo/collection'

export class ClientEvents {
  public client: Client
  public handlers: Collection<string, AbstractEvent>

  constructor(client: Client) {
    this.client = client
    this.handlers = new Collection<string, AbstractEvent>()
  }

  register(events: typeof AbstractEvent[]) {
    events.forEach(Event => {
      // @ts-ignore
      const e = new Event(this.client)
      this.handlers.set(e.name, e)
    })
  }
}
