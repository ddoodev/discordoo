import { BigBitField } from '@src/api/entities/bitfield/BigBitField'
import { EmptyBigBit, PermissionsFlags } from '@src/constants'
import { BigBitFieldResolvable } from '@src/api/entities/bitfield/interfaces'
import { PermissionsCheckOptions } from '@src/api/entities/bitfield/interfaces/PermissionsCheckOptions'

export class Permissions extends BigBitField {
  public static FLAGS = PermissionsFlags
  public static emptyBit = EmptyBigBit

  static get ALL(): bigint {
    return Object.values(PermissionsFlags).reduce((prev, curr) => prev | curr, this.emptyBit)
  }

  static get STAGE_MODERATOR(): bigint {
    return PermissionsFlags.MANAGE_CHANNELS | PermissionsFlags.MUTE_MEMBERS | PermissionsFlags.MOVE_MEMBERS
  }

  static get MANAGE_CHANNELS_PERMISSIONS(): bigint {
    return PermissionsFlags.MANAGE_ROLES
  }

  hasAny(bits: BigBitFieldResolvable, options?: PermissionsCheckOptions): boolean {
    return (options?.checkAdmin && super.has(PermissionsFlags.ADMINISTRATOR)) ? true : super.hasAny(bits)
  }

  has(bits: BigBitFieldResolvable, options?: PermissionsCheckOptions): boolean {
    return (options?.checkAdmin && super.has(PermissionsFlags.ADMINISTRATOR)) ? true : super.has(bits)
  }

  missing(bits: BigBitFieldResolvable, options?: PermissionsCheckOptions): this {
    return (options?.checkAdmin && super.has(PermissionsFlags.ADMINISTRATOR)) ? super.missing(this.emptyBit) : super.missing(bits)
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
