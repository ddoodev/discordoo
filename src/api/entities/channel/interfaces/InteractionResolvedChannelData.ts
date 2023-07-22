import { AbstractChannelData } from '../../../../../src/api'

export interface InteractionResolvedChannelData extends AbstractChannelData {
  name: string
  permissions: string
}
