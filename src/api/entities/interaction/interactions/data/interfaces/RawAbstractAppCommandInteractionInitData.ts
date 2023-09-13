import { RawAppCommandInteractionData } from '@src/api'

export interface RawAbstractAppCommandInteractionInitData extends RawAppCommandInteractionData {
  guildId?: string
  channelId?: string
}
