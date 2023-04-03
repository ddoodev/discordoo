import { AppCommandTypes } from '@src/constants'
import { AppCommandInteractionOptionPayload, RawInteractionResolvedData } from '@src/api'

export interface RawAppCommandInteractionData {
  /** the ID of the invoked command */
  id: string
  /** the name of the invoked command */
  name: string
  /** the type of the invoked command */
  type: AppCommandTypes
  /** converted users + roles + channels */
  resolved?: RawInteractionResolvedData
  /** the params + values from the user */
  options?: AppCommandInteractionOptionPayload[]
}
