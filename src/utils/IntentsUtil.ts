import { GatewayIntents } from '@src/constants/gateway/GatewayIntents'

export class IntentsUtil {
  public static FLAGS = GatewayIntents

  static get ALL(): GatewayIntents[] {
    return Object.values(GatewayIntents).filter(bit => typeof bit !== 'string') as GatewayIntents[]
  }

  static get PRIVILEGED(): GatewayIntents[] {
    return [ GatewayIntents.GUILD_MEMBERS, GatewayIntents.GUILD_PRESENCES, GatewayIntents.MESSAGE_CONTENT ]
  }

  static get NON_PRIVILEGED(): GatewayIntents[] {
    return IntentsUtil.ALL.filter((bit: any) => !IntentsUtil.PRIVILEGED.includes(bit))
  }

  static get ALL_NUMERIC(): number {
    return IntentsUtil.ALL.reduce((prev, curr) => prev | curr, 0)
  }

  static get PRIVILEGED_NUMERIC(): number {
    return IntentsUtil.PRIVILEGED.reduce((prev, curr) => prev | curr, 0)
  }

  static get NON_PRIVILEGED_NUMERIC(): number {
    return IntentsUtil.NON_PRIVILEGED.reduce((prev, curr) => prev | curr, 0)
  }
}
