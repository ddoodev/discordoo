import { AutocompleteInteractionData } from '@src/api/entities/interaction/interfaces/AutocompleteInteractionData'
import { is } from 'typescript-is'
import { ApplicationCommandOptionTypes } from '@src/constants'
import { WebSocketUtils } from '@src/utils/WebSocketUtils'

export function isValidAutocomplete(data: any): data is AutocompleteInteractionData {
  // value and options are mutually exclusive
  if (WebSocketUtils.exists(data?.value) && WebSocketUtils.exists(data?.options)) return false

  /**
   * manual validation to avoid infinite recursive validation of options arrays like
   * options: [ { options: [ { options: [ { options: [ { options: [ { options: ... } ] } ] } ] } ] } ]
   * */
  if (
    data?.options?.some(option => {
      if (
        option?.type !== ApplicationCommandOptionTypes.SUB_COMMAND_GROUP &&
        option?.type !== ApplicationCommandOptionTypes.SUB_COMMAND &&
        Array.isArray(option?.options)
      ) return true

      if (
        option?.some(o => o?.type !== ApplicationCommandOptionTypes.SUB_COMMAND && Array.isArray(o?.options))
      ) return true
    })
  ) return false

  return is<AutocompleteInteractionData>(data)
}
