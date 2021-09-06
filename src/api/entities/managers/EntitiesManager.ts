import { Client } from '@src/core'

export abstract class EntitiesManager {
  public client: Client

  protected constructor(client: Client) {
    this.client = client
  }
}
