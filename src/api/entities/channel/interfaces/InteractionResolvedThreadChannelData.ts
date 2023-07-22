import { InteractionResolvedChannelData, ThreadMetadata } from '../../../../../src/api'

export interface InteractionResolvedThreadChannelData extends InteractionResolvedChannelData {
  metadata: ThreadMetadata
  parentId: string
}
