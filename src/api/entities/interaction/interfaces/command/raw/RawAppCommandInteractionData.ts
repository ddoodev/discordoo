import { AppCommandTypes } from '@src/constants'
import { RawInteractionResolvedData } from '@src/api/entities/interaction/interfaces/RawInteractionResolvedData'
import { AppCommandInteractionOptionPayload }
  from '@src/api/entities/interaction/interfaces/command/AppCommandInteractionOptionPayload'

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
