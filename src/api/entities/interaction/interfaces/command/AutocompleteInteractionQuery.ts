import { AppCommandInteractionOptionPayload } from '../../../../../../src/api'
import { AppCommandOptionTypes } from '../../../../../../src/constants'

export type AutocompleteInteractionQuery = Omit<Required<AppCommandInteractionOptionPayload>, 'options'> & {
  type: AppCommandOptionTypes.String
    | AppCommandOptionTypes.Number
    | AppCommandOptionTypes.Integer
}
