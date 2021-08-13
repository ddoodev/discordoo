import { GatewayIntents } from '@src/constants/gateway/GatewayIntents'

export class IntentsUtil {
  public static FLAGS: GatewayIntents

  static get ALL(): GatewayIntents[] {
    return Object.values(GatewayIntents).filter(bit => typeof bit !== 'string') as GatewayIntents[]
  }

  static get PRIVILEGED(): GatewayIntents[] {
    return [ GatewayIntents.GUILD_MEMBERS, GatewayIntents.GUILD_PRESENCES ]
  }

  static get NON_PRIVILEGED(): GatewayIntents[] {
    return IntentsUtil.ALL.filter((bit: any) => !IntentsUtil.PRIVILEGED.includes(bit))
  }
}
