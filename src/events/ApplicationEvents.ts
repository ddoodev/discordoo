import { AbstractEvent } from '@src/events/AbstractEvent'
import { Collection } from '@discordoo/collection'
import { AbstractEventContext } from '@src/events/interfaces'
import { AnyDiscordApplication } from '@src/core/apps/AnyDiscordApplication'

export class ApplicationEvents {
  public app: AnyDiscordApplication
  public handlers: Collection<string, AbstractEvent<AbstractEventContext>>

  constructor(app: AnyDiscordApplication) {
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
