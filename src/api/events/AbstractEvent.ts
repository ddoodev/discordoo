import { Client } from '@src/core'

export abstract class AbstractEvent {
  public client: Client
  public name: string

  constructor(client: Client) {
    this.client = client
    this.name = 'abstract'
  }

  abstract execute(...args): unknown
}
