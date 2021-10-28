export interface ThreadChannelEditData {
  name?: string
  archived?: boolean
  autoArchiveDuration?: number
  locked?: boolean
  invitable?: boolean
  rateLimitPerUser?: number | null
}
