import { InteractionMessageCreateData } from '@src/api/entities/message/interfaces/MessageCreateData'
import { RawAppCommandOptionData } from '@src/api'
import { RawModalInteractionResponse } from '@src/api/entities/interaction/interfaces/modal/RawModalInteractionResponse'
import { InteractionResponseTypes } from '@src/constants'

export type RawInteractionResponseData = InteractionMessageCreateData | RawAppCommandOptionData[] | RawModalInteractionResponse

export interface RawInteractionResponse {
  type: InteractionResponseTypes
  data?: RawInteractionResponseData
}