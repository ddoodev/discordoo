import { DiscordApplication } from '@src/core'

export abstract class EntitiesManager {
  public app: DiscordApplication

  protected constructor(app: DiscordApplication) {
    this.app = app
  }
}
