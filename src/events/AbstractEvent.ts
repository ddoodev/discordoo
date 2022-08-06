import { Client } from '@src/core'
import { AnyEventContext } from '@src/events/AnyEventContext'

export abstract class AbstractEvent<Context extends AnyEventContext> {
  public client: Client
  public abstract name: string

  constructor(client: Client) {
    this.client = client
  }

  abstract execute(shardId: number, ...args: any[]): Context | Promise<Context>
}
