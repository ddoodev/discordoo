import { PermissionFlags } from '@src/constants'

/**
 * Overwritten permissions data.
 * @example ```js
 * {
 *   KICK_MEMBERS: true, // enabled
 *   BAN_MEMBERS: false, // disabled
 *   MANAGE_CHANNELS: null, // unset
 * }
 * ```
 * */
export type OverwrittenPermissions = { [K in keyof typeof PermissionFlags]?: boolean | null }
