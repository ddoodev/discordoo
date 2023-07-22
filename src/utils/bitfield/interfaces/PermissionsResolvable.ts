import { BigBitFieldResolvable } from '../../../../src/utils/bitfield/interfaces/BigBitFieldResolvable'
import { ReadonlyPermissions } from '../../../../src/utils/bitfield/ReadonlyPermissions'
import { Permissions } from '../../../../src/utils/bitfield/Permissions'

export type PermissionsResolvable = BigBitFieldResolvable<ReadonlyPermissions | Permissions>
