import { DISCORD_EPOCH } from '@src/constants/common'

/** Converts snowflake to timestamp */
export function idToTimestamp(id: string): number {
  return +id / 4194304 + DISCORD_EPOCH
}
