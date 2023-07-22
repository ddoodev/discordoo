import { RestEligibleDiscordApplication } from '../../../src/core/apps/AnyDiscordApplication'

export abstract class EntitiesManager {
  public app: RestEligibleDiscordApplication

  protected constructor(app: RestEligibleDiscordApplication) {
    this.app = app
  }
}
