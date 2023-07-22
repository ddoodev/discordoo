import { AppCommandOptionTypes } from '../../../../../../src/constants'

export interface AppCommandInteractionOptionPayload {
  /** the name of the parameter */
  name: string
  /** the type of option */
  type: AppCommandOptionTypes
  /** the value of the option resulting from user input */
  value?: string | number | boolean
  /** present if this option is a group or subcommand */
  options?: AppCommandInteractionOptionPayload[]
  /** `true` if this option is the currently focused option for autocomplete */
  focused?: boolean
}
