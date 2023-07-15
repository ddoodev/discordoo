import { InteractionResolvedChannelData, RawThreadMetadata } from '@src/api'

export interface RawInteractionResolvedThreadChannelData extends InteractionResolvedChannelData {
  thread_metadata: RawThreadMetadata
  parent_id: string
}
