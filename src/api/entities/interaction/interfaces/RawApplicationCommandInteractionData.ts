import { ApplicationCommandTypes } from '@src/constants'

export interface RawApplicationCommandInteractionData {
  id: string
  name: string
  type: ApplicationCommandTypes

}