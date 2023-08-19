import { FetchInviteQuery } from '@src/api'

export interface FetchInviteData extends FetchInviteQuery {
  code: string
}