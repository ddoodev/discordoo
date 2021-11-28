import { DISCORD_EPOCH } from '@src/constants/common'

/** Converts snowflake to date */
export function idToDate(id: string): Date {
  return new Date(Math.trunc(+id / 4194304 + DISCORD_EPOCH))
}
