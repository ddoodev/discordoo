import { AppCommandOptionTypes } from '@src/constants'

export interface AppCommandInteractionOptionData {
  /** the name of the parameter */
  name: string
  /** the type of option */
  type: AppCommandOptionTypes
  /** the value of the option resulting from user input */
  value?: string | number
  /** present if this option is a group or subcommand */
  options?: AppCommandInteractionOptionData[]
  /** `true` if this option is the currently focused option for autocomplete */
  focused?: boolean
}