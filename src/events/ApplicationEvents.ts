import { DiscordApplication } from '@src/core'
import { AbstractEvent } from '@src/events/AbstractEvent'
import { Collection } from '@discordoo/collection'
import { AbstractEventContext } from '@src/events/interfaces'

export class ApplicationEvents {
  public app: DiscordApplication
  public handlers: Collection<string, AbstractEvent<AbstractEventContext>>

  constructor(app: DiscordApplication) {
    this.app = app
    this.handlers = new Collection<string, AbstractEvent<AbstractEventContext>>()
  }

  register(events: any[]) {
    events.forEach(Event => {
      const e = new Event(this.app)
      this.handlers.set(e.name, e)
    })
  }
}
