import { GatewayIntents } from '@src/constants'

export class IntentsUtil {
  public static FLAGS: GatewayIntents

  static get ALL() {
    return Object.values(GatewayIntents).reduce((prev: any, curr: any) => prev | curr, 0)
  }

  static get PRIVILEGED() {
    return GatewayIntents.GUILD_MEMBERS | GatewayIntents.GUILD_PRESENCES
  }

  static get NON_PRIVILEGED() {
    return IntentsUtil.ALL & ~IntentsUtil.PRIVILEGED
  }
}
