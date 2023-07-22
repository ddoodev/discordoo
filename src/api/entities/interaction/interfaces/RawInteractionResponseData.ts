import { DeferPayloadData, InteractionMessageCreateData, RawAppCommandOptionData, RawAutocompletePayloadData, RawModalData } from '@src/api'
import { InteractionResponseTypes } from '@src/constants'

export type RawInteractionResponseData = InteractionMessageCreateData
  | RawAppCommandOptionData[]
  | RawModalData
  | RawAutocompletePayloadData
  | DeferPayloadData

export interface RawInteractionResponse {
  type: InteractionResponseTypes
  data?: RawInteractionResponseData
}
