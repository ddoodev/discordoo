import { AppCommandInteractionOptionPayload } from '@src/api/entities/interaction/interfaces/command/AppCommandInteractionOptionPayload'
import { is } from 'typescript-is'
import { AppCommandOptionTypes } from '@src/constants'
import { WebSocketUtils } from '@src/utils/WebSocketUtils'

export function isValidAutocomplete(data: any): data is AppCommandInteractionOptionPayload {
  // value and options are mutually exclusive
  if (WebSocketUtils.exists(data?.value) && WebSocketUtils.exists(data?.options)) return false

  /**
   * manual validation to avoid infinite recursive validation of options arrays like
   * options: [ { options: [ { options: [ { options: [ { options: [ { options: ... } ] } ] } ] } ] } ]
   * */
  if (
    data?.options?.some(option => {
      if (
        option?.type !== AppCommandOptionTypes.SubCommandGroup &&
        option?.type !== AppCommandOptionTypes.SubCommand &&
        Array.isArray(option?.options)
      ) return true

      if (
        option?.some(o => o?.type !== AppCommandOptionTypes.SubCommand && Array.isArray(o?.options))
      ) return true
    })
  ) return false

  return is<AppCommandInteractionOptionPayload>(data)
}
