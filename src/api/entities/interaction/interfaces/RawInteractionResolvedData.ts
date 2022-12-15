import { AnyRawChannelData, RawGuildMemberData, RawMessageAttachmentData, RawMessageData, RawRoleData, RawUserData } from '@src/api'

export interface RawInteractionResolvedData {
  users?: Record<string, RawUserData>
  members?: Record<string, RawGuildMemberData>
  roles?: Record<string, RawRoleData>
  channels?: Record<string, AnyRawChannelData>
  messages?: Record<string, RawMessageData>
  attachments?: Record<string, RawMessageAttachmentData>
}