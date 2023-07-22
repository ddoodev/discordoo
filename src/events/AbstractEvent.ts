import { DiscordApplication } from '../../src/core'
import { AnyEventContext } from '../../src/events/AnyEventContext'

export abstract class AbstractEvent<Context extends AnyEventContext> {
  public app: DiscordApplication
  public abstract name: string

  constructor(app: DiscordApplication) {
    this.app = app
  }

  abstract execute(shardId: number, ...args: any[]): Context | Promise<Context>
}
