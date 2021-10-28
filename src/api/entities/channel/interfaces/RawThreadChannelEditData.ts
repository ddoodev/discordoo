export interface RawThreadChannelEditData {
  name?: string
  archived?: boolean
  auto_archive_duration?: number
  locked?: boolean
  invitable?: boolean
  rate_limit_per_user?: number | null
}
