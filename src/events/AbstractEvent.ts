import { Client } from '@src/core'

export abstract class AbstractEvent {
  public client: Client
  public abstract name: string

  constructor(client: Client) {
    this.client = client
  }

  abstract execute(shardId: number, ...args: any[])
}
