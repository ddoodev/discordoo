import { AppCommandTypes } from '@src/constants'
import { AppCommandInteractionOptionData } from '@src/api/entities/interaction/interfaces/AppCommandInteractionOptionData'
import { InteractionResolvedData } from '@src/api/entities/interaction/interfaces/InteractionResolvedData'

export interface AppCommandPayloadData {
  /** the ID of the invoked command */
  id: string
  /** the name of the invoked command */
  name: string
  /** the type of the invoked command */
  type: AppCommandTypes
  /** converted users + roles + channels */
  resolved?: InteractionResolvedData
  /** the params + values from the user */
  options?: AppCommandInteractionOptionData[]
}