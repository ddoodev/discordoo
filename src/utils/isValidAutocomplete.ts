import { AppCommandInteractionOptionData } from '@src/api/entities/interaction/interfaces/AppCommandInteractionOptionData'
import { is } from 'typescript-is'
import { AppCommandOptionTypes } from '@src/constants'
import { WebSocketUtils } from '@src/utils/WebSocketUtils'

export function isValidAutocomplete(data: any): data is AppCommandInteractionOptionData {
  // value and options are mutually exclusive
  if (WebSocketUtils.exists(data?.value) && WebSocketUtils.exists(data?.options)) return false

  /**
   * manual validation to avoid infinite recursive validation of options arrays like
   * options: [ { options: [ { options: [ { options: [ { options: [ { options: ... } ] } ] } ] } ] } ]
   * */
  if (
    data?.options?.some(option => {
      if (
        option?.type !== AppCommandOptionTypes.SUB_COMMAND_GROUP &&
        option?.type !== AppCommandOptionTypes.SUB_COMMAND &&
        Array.isArray(option?.options)
      ) return true

      if (
        option?.some(o => o?.type !== AppCommandOptionTypes.SUB_COMMAND && Array.isArray(o?.options))
      ) return true
    })
  ) return false

  return is<AppCommandInteractionOptionData>(data)
}
