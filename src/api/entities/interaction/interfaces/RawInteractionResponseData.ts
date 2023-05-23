import { InteractionMessageCreateData, RawAppCommandOptionData, RawModalData } from '@src/api'
import { InteractionResponseTypes } from '@src/constants'

export type RawInteractionResponseData = InteractionMessageCreateData | RawAppCommandOptionData[] | RawModalData

export interface RawInteractionResponse {
  type: InteractionResponseTypes
  data?: RawInteractionResponseData
}
