import { RawAppCommandOptionData, RawModalInteractionResponse } from '@src/api'
import { InteractionResponseTypes } from '@src/constants'
import { InteractionMessageCreateData } from '@src/api/entities/message/interfaces/MessageCreateData'

export type RawInteractionResponseData = InteractionMessageCreateData | RawAppCommandOptionData[] | RawModalInteractionResponse

export interface RawInteractionResponse {
  type: InteractionResponseTypes
  data?: RawInteractionResponseData
}
