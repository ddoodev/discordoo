import { RawActionRowData, RawAllowedMentionsData, RawMessageEmbedData } from '../../../../../src/api'
import { RawAttachment } from '../../../../../../providers/src/_index'

export interface MessageEditData {
  content?: string
  embeds: RawMessageEmbedData[]
  files?: RawAttachment[]
  allowed_mentions?: RawAllowedMentionsData
  components: RawActionRowData[]
  flags?: 4 // only MessageFlags.SuppressEmbeds can be set
}
