import {
  AnyRawInteractionResolvedChannelData,
  RawGuildMemberData,
  RawMessageAttachmentData,
  RawMessageData,
  RawRoleData,
  RawUserData
} from '@src/api'

export interface RawInteractionResolvedData {
  users?: Record<string, RawUserData>
  members?: Record<string, RawGuildMemberData>
  roles?: Record<string, RawRoleData>
  channels?: Record<string, AnyRawInteractionResolvedChannelData>
  messages?: Record<string, RawMessageData>
  attachments?: Record<string, RawMessageAttachmentData>
}
