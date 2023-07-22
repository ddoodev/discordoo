import { AppCommandTypes } from '@src/constants'
import { AppCommandInteractionOptionPayload, InteractionResolvedData } from '@src/api'

export interface AppCommandInteractionPayload {
  /** the ID of the invoked command */
  id: string
  /** the name of the invoked command */
  name: string
  /** the type of the invoked command */
  type: AppCommandTypes
  /** converted users + roles + channels */
  resolved?: InteractionResolvedData
  /** the params + values from the user */
  options?: AppCommandInteractionOptionPayload[]
}
