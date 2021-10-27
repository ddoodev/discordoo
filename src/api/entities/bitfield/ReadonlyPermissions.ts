import { EmptyBigBit, PermissionFlags } from '@src/constants'
import { BigBitFieldResolvable } from '@src/api/entities/bitfield/interfaces'
import { PermissionsCheckOptions } from '@src/api/entities/bitfield/interfaces/PermissionsCheckOptions'
import { ReadonlyBigBitField } from '@src/api/entities/bitfield/ReadonlyBigBitField'

export class ReadonlyPermissions extends ReadonlyBigBitField {
  public static FLAGS: Readonly<typeof PermissionFlags> = PermissionFlags
  public static emptyBit = EmptyBigBit

  static get ALL(): bigint {
    return Object.values(PermissionFlags).reduce((prev, curr) => prev | curr, this.emptyBit)
  }

  static get STAGE_MODERATOR(): bigint {
    return PermissionFlags.MANAGE_CHANNELS | PermissionFlags.MUTE_MEMBERS | PermissionFlags.MOVE_MEMBERS
  }

  static get MANAGE_CHANNELS_PERMISSION(): bigint {
    return PermissionFlags.MANAGE_ROLES
  }

  hasAny(bits: BigBitFieldResolvable, options?: PermissionsCheckOptions): boolean {
    return (options?.checkAdmin && super.has(PermissionFlags.ADMINISTRATOR)) ? true : super.hasAny(bits)
  }

  has(bits: BigBitFieldResolvable, options?: PermissionsCheckOptions): boolean {
    return (options?.checkAdmin && super.has(PermissionFlags.ADMINISTRATOR)) ? true : super.has(bits)
  }

  missing(bits: BigBitFieldResolvable, options?: PermissionsCheckOptions): this {
    return (options?.checkAdmin && super.has(PermissionFlags.ADMINISTRATOR)) ? super.missing(this.emptyBit) : super.missing(bits)
  }

  serialize(options?: PermissionsCheckOptions): Record<string, boolean> {
    const result: Record<string, boolean> = {}

    for (const [ flag, bit ] of Object.entries((this.constructor as any).FLAGS)) {
      if (typeof bit === 'bigint') result[flag] = this.has(bit, options)
    }

    return result
  }

  toArray(options?: PermissionsCheckOptions): string[] {
    const result: string[] = []

    for (const [ flag, bit ] of Object.entries((this.constructor as any).FLAGS)) {
      if (typeof bit === 'bigint' && this.has(bit, options)) result.push(flag)
    }

    return result
  }

}
