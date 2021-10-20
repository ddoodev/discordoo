import { BigBitFieldResolvable } from '@src/api/entities/bitfield/interfaces/BigBitFieldResolvable'
import { ReadonlyPermissions } from '@src/api/entities/bitfield/ReadonlyPermissions'
import { Permissions } from '@src/api/entities/bitfield/Permissions'

export type PermissionsResolvable = BigBitFieldResolvable<ReadonlyPermissions | Permissions>
